class AddTransactionToEntry < ActiveRecord::Migration[5.1]
  def up
    change_column :entries, :entry_type, :string, default: 'Transaction'
    remove_column :entries, :is_transaction
    rename_column :entries, :transaction_date, :date
  end

  def down
    change_column :entries, :entry_type, :string, default: nil
    add_column    :entries, :is_transaction, :boolean
    rename_column :entries, :date, :transaction_date
  end
end
