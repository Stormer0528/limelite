class MoveEntriesOfBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    BankAccount::Item.where(payment_id: nil).each do |item|
      entry = Entry.where(journalable_type: "BankAccount::Item",
                          journalable_id: item.id).first
      item.update!(entry_id: entry.id) if entry
    end
  end
end
