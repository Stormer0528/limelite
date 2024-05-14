# == Schema Information
#
# Table name: entry_items
#
#  id              :bigint(8)        not null, primary key
#  entry_id        :bigint(8)
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  type            :string
#  account_id      :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  memo            :string
#  payable_type    :string
#  payable_id      :bigint(8)
#
# Indexes
#
#  index_entry_items_on_account_id                   (account_id)
#  index_entry_items_on_entry_id                     (entry_id)
#  index_entry_items_on_payable_type_and_payable_id  (payable_type,payable_id)
#  index_entry_items_on_type                         (type)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (entry_id => entries.id)
#

class EntryItem < ApplicationRecord
  monetize :amount_in_cents

  # Scopes
  #-----------------------------------------------------------------------------
  scope :credits, -> { where(type: "Credit") }
  scope :debits, -> { where type: "Debit" }

  scope :with_bank_account, -> { joins(account: :bank_account) }
  scope :draft, -> { joins(:entry).where(entries: {aasm_state: :draft}) }
  scope :submitted, -> { joins(:entry).where(entries: {aasm_state: [:needs_approval, :approved]}) }
  scope :approved, -> { joins(:entry).where(entries: {aasm_state: :approved}) }
  scope :by_min_amount, ->(amount) { where("ABS(entry_items.amount_in_cents) >= ?", amount) }
  scope :by_max_amount, ->(amount) { where("ABS(entry_items.amount_in_cents) <= ?", amount) }
  scope :dated_before,  ->(before_date) { joins(:entry).where("entries.date <= ?", before_date) }
  scope :dated_after,   ->(after_date)  { joins(:entry).where("entries.date >= ?", after_date) }
  scope :dated_between, ->(before_date, after_date) { joins(:entry).where(entries: {date: before_date..after_date}) }
  scope :by_org, ->(org_id) { joins(:entry).where(entries: {organization_id: org_id}) }
  scope :by_code, ->(type, code) {
                    if Entry.is_empty?(type) || Entry.is_empty?(code)
                      all
                    else
                      joins(account: :"account_#{type.to_s.singularize}")
                        .where("account_#{type.to_s.pluralize}": {code: code})
                    end
                  }
  scope :entry_type, ->(entry_type) { joins(:entry).where(entries: {entry_type: entry_type}) }
  scope :by_partial_memo, ->(memo) { where("memo LIKE ?", "%#{memo}%") }
  scope :standard_ordering, -> {
                              joins(account: [:account_fund, :account_resource, :account_year, :account_goal, :account_function, :account_object, :account_location]).order("entry_items.type DESC, account_objects.code ASC, account_funds.code ASC, account_resources.code ASC, account_years.code ASC, account_goals.code ASC, account_functions.code ASC, account_locations.code ASC, entry_items.amount_in_cents ASC")
                            }
  scope :by_vendor, ->(vendor_id) { where(payable_type: "Vendor", payable_id: vendor_id) }
  scope :by_customer, ->(customer_id) { where(payable_type: "Customer", payable_id: customer_id) }

  # Relationships
  #-----------------------------------------------------------------------------
  belongs_to :account
  belongs_to :entry, optional: false
  belongs_to :payable, polymorphic: true, optional: true

  has_one :payment, dependent: :destroy
  accepts_nested_attributes_for :payment

  delegate :account_function_code, :account_fund_code, :account_goal_code,
           :account_location_code, :account_object_code, :account_resource_code,
           :account_year_code,
           :account_function_name, :account_fund_name, :account_goal_name,
           :account_location_name, :account_object_name, :account_resource_name,
           :account_year_name,
           :account_function_id, :account_fund_id, :account_goal_id,
           :account_location_id, :account_object_id, :account_resource_id,
           :account_year_id,
           :account_fund,
           :account_object_display_name,
           to: :account, allow_nil: true

  delegate :number, :display_name, :name, to: :account, prefix: true, allow_nil: true
  delegate :date, :aasm_state, :entry_type, :journalable_type, to: :entry

  # VALIDATIONS
  #-----------------------------------------------------------------------------
  validates :type, presence: true
  validates :account, presence: {message: "does not exist"}
  validates :amount_in_cents,
            presence: {message: "must be a present"},
            numericality: {message: "must be a number"}

  # INSTANCE METHODS
  #-----------------------------------------------------------------------------
  def customer
    return nil unless payable&.is_a?(Customer)

    payable
  end

  def payable_name
    payable&.display_name
  end

  def positive_amount
    return amount unless is_a?(Debit)

    Money.new(amount * -1)
  end

  def vendor
    return nil unless payable&.is_a?(Vendor)

    payable
  end
end
