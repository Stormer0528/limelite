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

class BankAccount::Deposit < BankAccount::Item
  # Validations
  #---------------------------------------------------------------------------
  validate :entry_must_have_cash_account # This is slightly differnt from check

  def entry_must_have_cash_account
    return unless entry

    items = entry.entry_items.select {|item| item.type == "Debit" }
    unless items.map(&:account_object_code).include?(bank_account.object_code)
      errors.add(:entry, "must debit the bank account's Object Code [#{bank_account.object_code}]")
    end
  end
end
