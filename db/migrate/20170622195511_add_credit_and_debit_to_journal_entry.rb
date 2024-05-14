class AddCreditAndDebitToJournalEntry < ActiveRecord::Migration[5.0]
  def up
    rename_column :journal_entries, :amount_in_cents, :credit_in_cents
    add_column :journal_entries, :debit_in_cents, :integer, default: 0

  end

  def down
    rename_column :journal_entries, :credit_in_cents, :amount_in_cents
    remove_column :journal_entries, :debit_in_cents, :integer
  end
end
