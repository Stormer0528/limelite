# == Schema Information
#
# Table name: credit_card_items
#
#  id              :bigint(8)        not null, primary key
#  date            :date
#  memo            :string
#  file_url        :string
#  type            :string
#  entry_id        :bigint(8)
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  credit_card_id  :bigint(8)
#  aasm_state      :string           default("draft")
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  creator_id      :bigint(8)
#  number          :string
#
# Indexes
#
#  index_credit_card_items_on_aasm_state      (aasm_state)
#  index_credit_card_items_on_creator_id      (creator_id)
#  index_credit_card_items_on_credit_card_id  (credit_card_id)
#  index_credit_card_items_on_date            (date)
#  index_credit_card_items_on_entry_id        (entry_id)
#  index_credit_card_items_on_type            (type)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (credit_card_id => credit_cards.id)
#  fk_rails_...  (entry_id => entries.id)
#

class CreditCard::Item < ApplicationRecord
  include AASM
  include Loggable
  include Authable
  include ApprovableWithEntry
  include FileUploadable

  # Scopes
  #-----------------------------------------------------------------------------
  default_scope { order(date: :desc, created_at: :desc) }

  scope :dated_before,  ->(before_date) { where("credit_card_items.date <= ?", before_date) }
  scope :dated_after,   ->(after_date)  { where("credit_card_items.date >= ?", after_date) }
  scope :dated_between, ->(before_date, after_date) { where(date: before_date..after_date) }
  scope :reconciled,    -> { joins(:reconciliation) }
  scope :unreconciled,  -> { left_joins(:reconciliation).where(reconciliations: {id: nil}) }
  scope :by_state,          ->(state) { where(aasm_state: state) }
  scope :by_vendor_id,      ->(vendor_id) {
    joins(:entry, entry: :entry_items)
      .where(entry: {entry_items: {payable_id: vendor_id, payable_type: "Vendor"}})
  }
  scope :by_customer_id, ->(customer_id) {
                           joins(:entry, entry: :entry_items)
                             .where(entry: {entry_items: {payable_id: customer_id, payable_type: "Customer"}})
                         }

  scope :by_partial_memo,   ->(memo) { where("credit_card_items.memo LIKE ?", "%#{memo}%") }
  scope :by_min_amount,     ->(min_amount) {
                              where("credit_card_items.amount_in_cents >= ? ", Money.from_amount(min_amount).cents)
                            }
  scope :by_max_amount,     ->(max_amount) {
                              where("credit_card_items.amount_in_cents <= ? ", Money.from_amount(max_amount).cents)
                            }
  # Relationships
  #-----------------------------------------------------------------------------
  belongs_to :credit_card
  belongs_to :creator, class_name: "User"
  belongs_to :entry, dependent: :destroy, optional: true
  accepts_nested_attributes_for :entry

  has_many :vendors, through: :entry
  has_many :customers, through: :entry
  has_one :reconciliation, as: :reconcilable_item, dependent: :destroy

  # Delgations
  #-----------------------------------------------------------------------------
  delegate :entry_items, :entry_type, :balanced?, to: :entry
  delegate :balance, to: :entry, prefix: true
  delegate :organization, :organization_id, to: :credit_card

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    CreditCardItemPolicy
  end

  # Instance Methods
  #-----------------------------------------------------------------------------
  def name
    type.demodulize.underscore
  end

  def amount
    entry&.amount || Money.new(0)
  end

  def reconcile(statement_id: nil)
    return true if reconciliation

    create_reconciliation reconcilable: credit_card,
                          organization_id: credit_card&.organization&.id,
                          statement_id: statement_id,
                          reconcilable_item_id: id
  end

  def reconciled?
    !reconciliation.nil?
  end

  def amount_cents
    amount.to_s.split(".")[1]
  end

  def payee
    vendors.map(&:name).uniq.join(", ")
  end

  def amount_in_cents
    entry&.amount_in_cents || Money.new(0)
  end

  def date
    entry&.date
  end
end
