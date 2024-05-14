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

class BankAccount::AccountTransfer < BankAccount::Item
  has_one :bank_account_item, ->(item) { where.not(id: item.id) },
          class_name: "BankAccount::Item",
          foreign_key: :entry_id,
          primary_key: :entry_id

  before_destroy :delete_bank_account_item

  def delete_bank_account_item
    return true unless bank_account_item

    item = bank_account_item
    item.update(entry_id: nil)
    item.destroy
  end

  # Validations
  #---------------------------------------------------------------------------
  validate :entry_must_have_cash_accounts, :entry_must_have_bank_account

  def entry_must_have_cash_accounts
    return unless entry

    account_object_ids = bank_account.organization.bank_accounts.map(&:account_object_id)
    bank_accounts_referenced = entry.entry_items.map(&:account_object_id).filter {|id| account_object_ids.include? id }

    unless bank_accounts_referenced.count > 1
      errors.add(:entry, "must reference more than one account object connected to a bank account")
    end
  end

  def entry_must_have_bank_account
    return unless entry

    unless entry.entry_items.map(&:account_object_code).include?(bank_account.object_code)
      errors.add(:entry, "must reference the object connected to the bank account")
    end
  end

  # Instance Methods
  #---------------------------------------------------------------------------
  def from_bank_account_item
    @from_bank_account_item ||= entry_items_amount.negative? ? bank_account_item : self
  end

  def to_bank_account_item
    @to_bank_account_item ||= entry_items_amount.negative? ? self : bank_account_item
  end

  def from_bank_account_item?
    from_bank_account_item.id == id
  end

  def to_bank_account_item?
    to_bank_account_item.id == id
  end

  def approved_at
    state_change_logs.order(created_at: :desc).first&.updated_at
  end

  def approver_name
    state_change_logs.order(created_at: :desc).first&.user&.full_name
  end

  # State Machine
  #-----------------------------------------------------------------------------
  aasm whiny_transitions: false do
    event :send_for_approval, after: proc {|*args| send_transfer_and_entry_for_approval(*args) } do
      transitions from: [:draft, :needs_revision],
                  to: :approved,
                  guard: proc {|args| args&.dig(:admin) }
      transitions from: [:draft, :needs_revision],
                  to: :needs_approval,
                  after: proc {|args| start_authorization(args) }
    end

    event :approve, after: proc {|*args| approve_transfer_and_entry(*args) } do
      transitions from: :needs_approval,
                  to: :approved,
                  after: :handle_auth,
                  guard: proc {|args| auth_finished?(args) }
    end

    event :deny, after: proc {|*args| deny_transfer_and_entry(*args) } do
      transitions from: :needs_approval, to: :needs_revision, after: proc {|args| handle_deny(args) }
    end

    event :reverse_approval, after: proc {|*args| reverse_transfer_and_entry_approval(*args) } do
      transitions from: :approved, to: :needs_revision
    end
  end

  private

  # Entry states
  #-----------------------------------------------------------------------------
  def send_transfer_and_entry_for_approval(*args)
    save
    bank_account_item.send_for_approval(*args) if bank_account_item&.may_send_for_approval?(*args)
    entry.send_for_approval(*args) if entry&.may_send_for_approval?(*args)
  end

  def approve_transfer_and_entry(*args)
    save
    bank_account_item.approve(*args) if bank_account_item&.may_approve?(*args)
    entry.approve(*args) if entry&.may_approve?(*args)
  end

  def deny_transfer_and_entry(*args)
    save
    bank_account_item.deny(*args) if bank_account_item&.may_deny?(*args)
    entry.deny(*args) if entry&.may_deny?(*args)
  end

  def reverse_transfer_and_entry_approval(*args)
    save
    bank_account_item.reverse_approval(*args) if bank_account_item&.may_reverse_approval?(*args)
    entry.reverse_approval(*args) if entry&.may_reverse_approval?(*args)
  end
end
