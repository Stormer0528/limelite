class AddTransactionDateToJournalEntry < ActiveRecord::Migration[5.0]
  def change
    add_column :journal_entries, :transaction_date, :date
  end
end
