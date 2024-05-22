# == Schema Information
#
# Table name: bank_account_items
#
#  id              :bigint(8)        not null, primary key
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  date            :date
#  memo            :string
#  number          :string
#  type            :string
#  bank_account_id :bigint(8)
#  creator_id      :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  paper_check     :boolean          default(FALSE)
#  file_url        :string
#  aasm_state      :string
#  address_id      :bigint(8)
#  entry_id        :bigint(8)
#  check_type      :string
#
# Indexes
#
#  index_bank_account_items_on_aasm_state                  (aasm_state)
#  index_bank_account_items_on_address_id                  (address_id)
#  index_bank_account_items_on_bank_account_id             (bank_account_id)
#  index_bank_account_items_on_creator_id                  (creator_id)
#  index_bank_account_items_on_date                        (date)
#  index_bank_account_items_on_entry_id                    (entry_id)
#  index_bank_account_items_on_number_and_bank_account_id  (number,bank_account_id) UNIQUE WHERE ((number)::text <> ''::text)
#  index_bank_account_items_on_type                        (type)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (bank_account_id => bank_accounts.id)
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (entry_id => entries.id)
#

class BankAccount::Item < ApplicationRecord
  include AASM
  include Loggable
  include Authable
  include ApprovableWithEntry
  include FileUploadable

  # Scopes
  #-----------------------------------------------------------------------------
  scope :dated_before,      ->(before_date) { where("bank_account_items.date <= ?", before_date) }
  scope :dated_after,       ->(after_date)  { where("bank_account_items.date >= ?", after_date) }
  scope :dated_between,     ->(before_date, after_date) { where(date: before_date..after_date) }
  scope :reconciled,        -> { includes(:reconciliation).where.not(reconciliations: {id: nil}) }
  scope :unreconciled,      -> { includes(:reconciliation).where(reconciliations: {id: nil}) }
  scope :by_partial_number, ->(number) { where("bank_account_items.number LIKE ?", "%#{number}%") }
  scope :by_state,          ->(state) { where(aasm_state: state) }
  scope :by_vendor_id,      ->(vendor_id) {
                              joins(:entry, entry: :entry_items)
                                .where(entry: {entry_items: {payable_id: vendor_id, payable_type: "Vendor"}})
                            }
  scope :by_customer_id,    ->(customer_id) {
                              joins(:entry, entry: :entry_items)
                                .where(entry: {entry_items: {payable_id: customer_id, payable_type: "Customer"}})
                            }
  scope :by_partial_memo,   ->(memo) { where("bank_account_items.memo LIKE ?", "%#{memo}%") }
  scope :by_min_amount,     ->(min_amount) {
                              where("ABS(bank_account_items.amount_in_cents) >= ? ", Money.from_amount(min_amount).cents)
                            }
  scope :by_max_amount,     ->(max_amount) {
                              where("ABS(bank_account_items.amount_in_cents) <= ? ", Money.from_amount(max_amount).cents)
                            }
  scope :approved,          -> { where(aasm_state: [:printed, :approved, :voided]) }

  # Check specific scopes
  scope :printed,    -> { where(aasm_state: [:printed, :voided], paper_check: true) }
  scope :unprinted,  -> { where.not(aasm_state: [:printed, :voided]) }

  # Validations
  #-----------------------------------------------------------------------------
  # validates_with ApprovalValidator
  validates_with ReconciledValidator
  validates_uniqueness_of :number, scope: :bank_account_id, allow_blank: true

  # Relationships
  #-----------------------------------------------------------------------------
  belongs_to :bank_account
  belongs_to :creator, class_name: "User"
  belongs_to :entry, dependent: :destroy, optional: true
  accepts_nested_attributes_for :entry
  has_many :vendors, through: :entry
  has_many :customers, through: :entry

  has_many :payments, foreign_key: :bank_account_item_id, dependent: :destroy
  has_many :invoices, -> { distinct }, through: :payments

  belongs_to :address, optional: true

  has_many :entry_items, ->(item) {
    joins(account: :bank_account)
      .where("bank_accounts.id = ?", item.bank_account_id)
  }, foreign_key: :entry_id, primary_key: :entry_id

  has_one :reconciliation, as: :reconcilable_item, dependent: :destroy

  # Delgations
  #-----------------------------------------------------------------------------
  delegate :name, to: :bank_account, prefix: true
  delegate :organization, :organization_id, to: :bank_account

  # Callback
  #-----------------------------------------------------------------------------
  before_save :update_amount

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    BankItemPolicy
  end

  def update_amount
    self.amount = entry_items.present? ? entry_items_amount : 0
  end

  def amount_in_cents
    super.abs
  end

  def entry_items_amount
    Money.new entry_items.inject(0) {|total, item| item.amount + total }
  end

  # Money
  #-----------------------------------------------------------------------------
  monetize :amount_in_cents

  # Instance Methods
  #-----------------------------------------------------------------------------
  def reconcile(statement_id: nil)
    return true if reconciliation

    create_reconciliation reconcilable: bank_account,
                          organization_id: bank_account&.organization&.id,
                          statement_id: statement_id,
                          reconcilable_item_id: id
  end

  def reconciled?
    reconciliation.present?
  end

  def amount_cents
    amount.to_s.split(".")[1]
  end

  def payee
    address&.addressable&.name
  end

  def entry_items_by_fund_code
    entry_items.group_by(&:account_fund_code)
  end

  def entry_items_fund_code_totals
    totals = entry_items_by_fund_code.map do |fund_code, items|
      total = items.inject(Money.new(0)) {|tot, item| tot + item.amount }

      total_array = total >= 0 ? [total.to_f, 0] : [0, total.to_f.abs]

      [fund_code, total_array]
    end

    totals.to_h
  end

  # Used for path and credit/debits
  #-----------------------------------------------------------------------------
  def name
    type.demodulize.underscore
  end

  def type_name(current_account=account)
    name = type.demodulize.underscore
    return name if name != "account_transfer"

    current_account.id == bank_account_id ? "to_account_transfer" : "from_account_transfer"
  end

  def accounts
    return [] unless entry

    entry.accounts.where.not(account_object_id: bank_account.account_object.id)
  end

  # Override auth_finished? method for bank account items
  #-----------------------------------------------------------------------------
  def auth_finished?(args)
    return true unless current_auth

    group = UserGroup.find(args[:user_group_id])
    permission = group.module_permissions.dig(record_class)

    return false unless args[:admin] || ["Owner", "Editor"].include?(permission)      

    auth = current_auth || authorizations.new
    auth_approve  user_id: args[:user_id],
                  user_group_id: args[:user_group_id],
                  reason: args[:reason]

    true
  end
end
