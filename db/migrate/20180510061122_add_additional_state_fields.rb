class AddAdditionalStateFields < ActiveRecord::Migration[5.1]
  def change
    add_column :bank_account_items, :aasm_state, :string, index: true
    add_column :invoices, :aasm_state, :string, index: true
    add_column :vendors, :aasm_state, :string, index: true
    add_column :customers, :aasm_state, :string, index: true
    add_column :entries, :aasm_state, :string, index: true
  end
end
