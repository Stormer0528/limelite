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

# AKA: Manual Check
#-------------------------------------------------------------------------------
# -- are created manually from the bank account view.
# -- have one Entry to track the debit/credit to/from the cash account.
# -- don't belong to a payment

class BankAccount::Check < BankAccount::Item
  CHECK_TYPES = ["ACH", "Wire", "Print", "Unknown"].freeze

  # Delegations
  delegate :routing_number, to: :bank_account, allow_nil: true
  delegate :number, to: :bank_account, allow_nil: true, prefix: :account

  # Scopes
  scope :numbered,   -> { where.not(number: nil) }
  scope :unnumbered, -> { where(number: nil) }
  scope :printable,  -> { where(aasm_state: :approved, paper_check: false) }

  # Validations
  #---------------------------------------------------------------------------
  validates_presence_of :entry, if: -> { address_id.present? }
  validate :entry_must_have_cash_account
  # validate :addressable_must_match_vendor

  def entry_must_have_cash_account
    return unless entry

    items = entry.entry_items.select {|item| item.type == "Credit" }

    unless items.map(&:account_object_code).include?(bank_account.object_code)
      errors.add(:entry, "must credit the bank account's Object Code [#{bank_account.object_code}]")
    end
  end

  def addressable_must_match_vendor
    return unless address_id && entry

    items = entry.entry_items.select {|item| item.type == "Credit" }

    errors.add(:address, "must belong to a vendor.") unless items.map(&:payable).include?(address&.addressable)
  end

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    CheckPolicy
  end

  # Instance Methods
  #---------------------------------------------------------------------------
  def memo
    return super unless payments.length > 0

    case invoices.length
    when 0
      nil
    when 1
      "Invoice ##{invoices.first&.number}"
    else
      "Payments processed on #{date&.to_formatted_s(:std)}"
    end
  end

  def editable?
    !printed? && !reconciled?
  end

  # State Machine
  #-----------------------------------------------------------------------------
  aasm whiny_transitions: false do
    state :needs_approval, :approved, :needs_revision, :printed, :voided

    event :print, after: proc { save } do
      transitions from: :approved, to: :printed
    end

    event :void, after: proc {|*args| remove_entry(*args) } do
      transitions from: [:draft, :needs_approval, :needs_revision,
                         :approved, :printed],
                  to: :voided
    end
  end

  private

  # Entry states
  #-----------------------------------------------------------------------------
  def remove_entry(*_args)
    temp_id = entry_id
    payments.destroy_all
    update(entry_id: nil, address_id: nil, amount_in_cents: 0)
    Entry.find(temp_id).destroy if temp_id
  end
end
