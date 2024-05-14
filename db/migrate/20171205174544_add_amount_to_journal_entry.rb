class AddAmountToJournalEntry < ActiveRecord::Migration[5.1]
  def change
    add_monetize :journal_entries, :amount
  end
end
