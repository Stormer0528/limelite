class RemoveItemsFromJournalEntry < ActiveRecord::Migration[5.1]
  def change
    remove_column :journal_entries, :credit_in_cents
    remove_column :journal_entries, :debit_in_cents
    remove_column :journal_entries, :amount_in_cents
    remove_column :journal_entries, :amount_currency
    remove_column :journal_entries, :account_id
  end
end
