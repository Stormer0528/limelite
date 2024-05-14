class AddAccountToJournalEntries < ActiveRecord::Migration[5.0]
  def change
    add_reference :journal_entries, :account, foreign_key: true
  end
end
