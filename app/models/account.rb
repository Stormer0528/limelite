# == Schema Information
#
# Table name: accounts
#
#  id                  :integer          not null, primary key
#  organization_id     :integer
#  restriced           :boolean
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  account_function_id :integer
#  account_fund_id     :integer
#  account_goal_id     :integer
#  account_location_id :integer
#  account_object_id   :integer
#  account_resource_id :integer
#  account_year_id     :integer
#  slug                :string
#  budget_in_cents     :integer          default(0), not null
#  budget_currency     :string           default("USD"), not null
#
# Indexes
#
#  index_accounts_on_account_function_id       (account_function_id)
#  index_accounts_on_account_fund_id           (account_fund_id)
#  index_accounts_on_account_goal_id           (account_goal_id)
#  index_accounts_on_account_location_id       (account_location_id)
#  index_accounts_on_account_object_id         (account_object_id)
#  index_accounts_on_account_resource_id       (account_resource_id)
#  index_accounts_on_account_year_id           (account_year_id)
#  index_accounts_on_multiple_references       (organization_id,account_function_id,account_fund_id,account_goal_id,account_location_id,account_object_id,account_resource_id,account_year_id) UNIQUE
#  index_accounts_on_organization_id           (organization_id)
#  index_accounts_on_slug                      (slug)
#  index_accounts_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (account_function_id => account_functions.id)
#  fk_rails_...  (account_fund_id => account_funds.id)
#  fk_rails_...  (account_goal_id => account_goals.id)
#  fk_rails_...  (account_location_id => account_locations.id)
#  fk_rails_...  (account_object_id => account_objects.id)
#  fk_rails_...  (account_resource_id => account_resources.id)
#  fk_rails_...  (account_year_id => account_years.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class Account < ApplicationRecord
  extend FriendlyId
  friendly_id :slug_candidates, use: :scoped, scope: :organization

  delegate :name, :normal_balance, to: :account_object

  # Scopes
  #-----------------------------------------------------------------------------
  scope :cash_accounts, -> {joins(:bank_account)}
  scope :by_code, ->(type, code){ (Account::is_empty?(type) || Account::is_empty?(code)) ? all :
    joins(:"account_#{type.to_s.singularize}").where(:"account_#{type.to_s.pluralize}" => {code: code}) }
  scope :by_partial_code, ->(type, code){ (type.empty? || code.empty?) ? all :
    joins(:"account_#{type.to_s.singularize}").where("account_#{type.to_s.pluralize}.code ILIKE CONCAT('%',?,'%')", code) }
  scope :by_name, ->(name){
    name.empty? ? all : joins(:account_object).where("account_objects.name ILIKE CONCAT('%',?,'%')", name)
  }
  scope :standard_ordering, -> {
    joins(:account_fund, :account_resource, :account_year, :account_goal,
          :account_function, :account_object, :account_location)
    .order("account_funds.code ASC, account_resources.code ASC, account_years.code ASC, account_goals.code ASC, account_functions.code ASC, account_objects.code ASC, account_locations.code ASC")
  }

  # CONSTANTS
  ELEMENTS = ["fund", "resource", "year", "goal", "function", "object", "location"].freeze
  CODE_SEPARATOR = "-".freeze

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization

  belongs_to :account_fund, required: true
  delegate :code, :name, to: :account_fund, prefix: true, allow_nil: true

  belongs_to :account_resource, required: true
  delegate :code, :name, to: :account_resource, prefix: true, allow_nil: true

  belongs_to :account_year, required: true
  delegate :code, :name, to: :account_year, prefix: true, allow_nil: true

  belongs_to :account_goal, required: true
  delegate :code, :name, to: :account_goal, prefix: true, allow_nil: true

  belongs_to :account_function, required: true
  delegate :code, :name, to: :account_function, prefix: true, allow_nil: true

  belongs_to :account_object, required: true
  delegate :code, :name, :display_name, to: :account_object, prefix: true, allow_nil: true
  delegate :object_type, :normal_balance, to: :account_object, allow_nil: true

  belongs_to :account_location, required: true
  delegate :code, :name, to: :account_location, prefix: true, allow_nil: true

  has_one :bank_account, foreign_key: :account_object_id,
    primary_key: :account_object_id, required: false

  has_many :entry_items
  has_many :entries, -> { distinct }, through: :entry_items

  has_many :budgets, dependent: :destroy
  accepts_nested_attributes_for :budgets, allow_destroy: true

  # VALIDATIONS
  #-----------------------------------------------------------------------------
  validates_uniqueness_of :organization_id,
    scope: %i[account_function_id account_fund_id account_goal_id
              account_location_id account_object_id account_resource_id
              account_year_id]

  # CLASS METHODS
  #-----------------------------------------------------------------------------
  def self.by_number(number)
    return all unless number.present?

    number.split(CODE_SEPARATOR).each_with_index.inject(all) do |accounts, (code, index)|
      accounts.by_code(ELEMENTS[index], code)
    end
  end

  def self.by_partial_number(
    fund:     nil,
    resource: nil,
    year:     nil,
    goal:     nil,
    function: nil,
    object:   nil,
    location: nil,
    organization_id: nil
  )
    return unless organization_id
    elem_ids = self.element_codes_from_partial_code(fund: fund, resource: resource, year: year, goal: goal, function: function, object: object, location: location, organization_id: organization_id)

    find_by(elem_ids.merge(organization_id: organization_id))
  end

  # Returns hash with ids for given codes
  # fills in missing values with default account element
  def self.element_codes_from_partial_code(
    fund:     nil,
    resource: nil,
    year:     nil,
    goal:     nil,
    function: nil,
    object:   nil,
    location: nil,
    organization_id: nil
  )
    ELEMENTS.reduce({}) do |hash, elem|
      elem_class = "account_#{elem}".classify.constantize
      account = eval(elem)&.present? ?
        elem_class.find_by(code: eval(elem), organization_id: organization_id) :
        elem_class.default.find_by(organization_id: organization_id)
      hash["account_#{elem}_id"] = account&.id
      hash
    end
  end

  def self.create_with_partial_code(
    budget:   0.0,
    fund:     nil,
    resource: nil,
    year:     nil,
    goal:     nil,
    function: nil,
    object:   nil,
    location: nil,
    fiscal_year:     nil,
    organization_id: nil
  )
    elem_ids = self.element_codes_from_partial_code(fund: fund, resource: resource, year: year, goal: goal, function: function, object: object, location: location, organization_id: organization_id)

    # Create account with defaults
    account = find_or_initialize_by elem_ids.merge(elem_ids.merge(organization_id: organization_id))
    account.save
    account.budgets.create(fiscal_year: fiscal_year, amount: budget) unless budget.zero?
    account
  end

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    AccountPolicy
  end

  # INSTANCE METHODS
  #-----------------------------------------------------------------------------
  def number
    ELEMENTS.map {|elem| send("account_#{elem}_code") }.join(CODE_SEPARATOR)
  end

  def slug_candidates
    [:number]
  end

  # Display Name
  def display_name
    [slug, "-", name].join(" ")
  end

  # Add Date for filtering

  def start_date
    @start_date
  end

  def start_date=(date)
    @start_date = date&.to_date
  end

  def end_date
    @end_date
  end

  def end_date=(date)
    @end_date = date&.to_date
  end

  # Balance Methods
  def total_submitted
    @submitted = Entry::EntryItemSearch.new(
      scope: entry_items,
      filters: {
        organization_id: organization_id,
        start_date_with_beginning_balance:      start_date,
        end_date:        end_date,
        submitted:        true
      }
    ).results.select("entry_items.type, SUM(entry_items.amount_in_cents) AS amount_in_cents").group(:type)
  end

  def submitted_balance
    total_submitted
    return Money.new(0.00) if @submitted.empty?
    credit = if @submitted.find{|x| x["type"] == "Credit"}
               Money.new @submitted.find{|x| x["type"] == "Credit"}["amount_in_cents"]
             else
               Money.new 0.00
             end
    debit = if @submitted.find{|x| x["type"] == "Debit"}
              Money.new @submitted.find{|x| x["type"] == "Debit"}["amount_in_cents"]
            else
              Money.new 0.00
            end
    bal = credit - debit
    normal_balance == "Debit" ? -bal : bal
  end

  def total_approved
    @approved = Entry::EntryItemSearch.new(
      scope: entry_items,
      filters: {
        organization_id: organization_id,
        start_date_with_beginning_balance:      start_date,
        end_date:        end_date,
        approved:        true
      }
    ).results.select("entry_items.type, SUM(entry_items.amount_in_cents) AS amount_in_cents").group(:type)
  end

  def approved_balance
    total_approved
    return Money.new(0.00) if @approved.empty?

    credit = if @approved.find{|x| x["type"] == "Credit"}
               Money.new @approved.find{|x| x["type"] == "Credit"}["amount_in_cents"]
             else
               Money.new 0.00
             end
    debit = if @approved.find{|x| x["type"] == "Debit"}
              Money.new @approved.find{|x| x["type"] == "Debit"}["amount_in_cents"]
            else
              Money.new 0.00
            end
    bal = credit - debit
    normal_balance == "Debit" ? -bal : bal
  end

  def submitted_budget_balance_percentage(year=FiscalYear.get_year.year)
    budget = current_budget(year)
    budget.zero? ? Money.new(0.00) : ((submitted_balance/current_budget(year)) * 100.0).to_f
  end

  def approved_budget_balance_percentage(year=FiscalYear.get_year.year)
    budget = current_budget(year)
    budget.zero? ? Money.new(0.00) : (((approved_balance || Money.new(0.00))/current_budget(year)) * 100.0).to_f
  end

  def current_budget(year=FiscalYear.get_year.year)
    budgets.find_by(fiscal_year: year)&.amount || Money.new(0.00)
  end

  # checks empty but allows objects of other classes
  def self.is_empty?(val)
      val.class.name == "String" ? val.empty? : val.nil?
  end
end
