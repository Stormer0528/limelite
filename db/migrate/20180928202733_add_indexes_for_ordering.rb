class AddIndexesForOrdering < ActiveRecord::Migration[5.1]
  def change
    add_index :invoices, :due_date
    add_index :vendors, :company
    add_index :vendors, :first_name
    add_index :bank_account_items, :date
    add_index :bank_account_items, :aasm_state
  end
end
