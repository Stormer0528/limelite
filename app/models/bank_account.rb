# == Schema Information
#
# Table name: bank_accounts
#
#  id                        :bigint(8)        not null, primary key
#  pseudo                    :string
#  number                    :string
#  name                      :string
#  description               :text
#  started_at                :date
#  ended_at                  :date
#  edp_number                :string
#  state_account_number      :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  organization_id           :bigint(8)
#  starting_balance_in_cents :integer          default(0), not null
#  starting_balance_currency :string           default("USD"), not null
#  account_object_id         :bigint(8)
#  slug                      :string
#  routing_number            :string
#  bank_name                 :string
#  fractional_number         :string
#  creator_id                :bigint(8)
#
# Indexes
#
#  index_bank_accounts_on_account_object_id         (account_object_id)
#  index_bank_accounts_on_creator_id                (creator_id)
#  index_bank_accounts_on_organization_id           (organization_id)
#  index_bank_accounts_on_slug                      (slug)
#  index_bank_accounts_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (account_object_id => account_objects.id)
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class BankAccount < ApplicationRecord
  extend FriendlyId
  friendly_id :slug_candidates, use: :scoped, scope: :organization

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization
  belongs_to :account_object

  has_many :checks,   class_name: "BankAccount::Check",
                      table_name: "bank_account_items"
  has_many :deposits, class_name: "BankAccount::Deposit",
                      table_name: "bank_account_items"

  # Transfers
  has_many :account_items,          class_name: "BankAccount::Item"
  has_many :account_transfers,      class_name: "BankAccount::AccountTransfer",
                                    table_name: "bank_account_items"

  has_many :statements, as: :statementable
  has_many :reconciliations
  has_many :accounts, foreign_key: :account_object_id, primary_key: :account_object_id
  has_many :vendors, through: :checks

  # DELEGATIONS
  #-----------------------------------------------------------------------------
  delegate :code, :name, to: :account_object, allow_nil: true, prefix: "object"

  # Money
  #-----------------------------------------------------------------------------
  monetize :starting_balance_in_cents

  # VALIDATIONS
  #-----------------------------------------------------------------------------
  validates :started_at, presence: true
  validates :number, presence: true
  # validates :starting_balance_in_cents, presence: true, numericality: true

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    StandardPolicy
  end

  # INSTANCE METHODS
  #------------------------------------------------------------------------------
  #

  # includes all associated items use instead of account_items
  alias_attribute :items, :account_items

  def last_statement(before_date=Date.today)
    statements.approved.where("ended_at <= ?", before_date).order(ended_at: :desc).first ||
    statements.new(started_at: started_at.prev_month.at_beginning_of_month,
                   ended_at: started_at.prev_month.at_end_of_month)
  end

  def last_statement_balance(before_date=Date.today)
    last_statement(before_date).persisted? ? last_statement(before_date).ending_balance : starting_balance
  end

  def last_reconciled_date
    statements.order(ended_at: :desc).limit(1).pluck(:ended_at).first
  end

  # APPROVED TOTALS (only includes states :approved, :printed, :voided)
  #-----------------------------------------------------------------------------
  #
  def balance(date=nil)
    starting_balance + total_deposits(date) + total_account_transfers(date) - total_checks(date)
  end

  alias balance_as_of balance

  def total_deposits(date=nil)
    selected_deposits = date.nil? ? deposits.approved : deposits.approved.dated_before(date)
    Money.new selected_deposits.select(:amount_in_cents).sum(:amount_in_cents) * -1
  end

  def total_checks(date=nil)
    selected_checks = date.nil? ? checks.approved : checks.approved.dated_before(date)
    Money.new selected_checks.select(:amount_in_cents).sum(:amount_in_cents)
  end

  def total_account_transfers(date=nil)
    selected_account_transfers = date.nil? ? account_transfers.approved : account_transfers.approved.dated_before(date)
    Money.new selected_account_transfers.select(:amount_in_cents).sum(:amount_in_cents)
  end

  def monthly_deposits(date=DateTime.now)
    total_deposits(date.beginning_of_month) - total_deposits(date)
  end

  def monthly_checks(date=DateTime.now)
    total_checks(date.beginning_of_month) - total_checks(date)
  end

  def monthly_account_transfers(date=DateTime.now)
    total_account_transfers(date.beginning_of_month) - total_account_transfers(date)
  end

  # SUBMITTED TOTALS (includes all states)
  #-----------------------------------------------------------------------------
  #
  def submitted_balance(date=nil)
    starting_balance + total_submitted_deposits(date) + total_submitted_account_transfers(date) - total_submitted_checks(date)
  end

  alias submitted_balance_as_of submitted_balance

  def total_submitted_deposits(date=nil)
    selected_deposits = date.nil? ? deposits : deposits.dated_before(date)
    Money.new selected_deposits.select(:amount_in_cents).sum(:amount_in_cents) * -1
  end

  def total_submitted_checks(date=nil)
    selected_checks = date.nil? ? checks : checks.dated_before(date)
    Money.new selected_checks.select(:amount_in_cents).sum(:amount_in_cents)
  end

  def total_submitted_account_transfers(date=nil)
    selected_account_transfers = date.nil? ? account_transfers : account_transfers.dated_before(date)
    Money.new selected_account_transfers.select(:amount_in_cents).sum(:amount_in_cents)
  end

  def monthly_submitted_deposits(date=DateTime.now)
    total_submitted_deposits(date.beginning_of_month) - total_submitted_deposits(date)
  end

  def monthly_submitted_checks(date=DateTime.now)
    total_submitted_checks(date.beginning_of_month) - total_submitted_checks(date)
  end

  def monthly_submitted_account_transfers(date=DateTime.now)
    total_submitted_account_transfers(date.beginning_of_month) - total_submitted_account_transfers(date)
  end

  def slug_candidates
    [
      :name,
      :pseudo,
      [:name, number&.last(4)]
    ]
  end
end
