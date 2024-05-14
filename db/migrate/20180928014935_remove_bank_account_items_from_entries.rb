class RemoveBankAccountItemsFromEntries < ActiveRecord::Migration[5.1]
  def change
    Entry.where(journalable_type: 'BankAccount::Item').each do |entry|
      entry.update_columns(journalable_type: nil, journalable_id: nil)
    end
  end
end
