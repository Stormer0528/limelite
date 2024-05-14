class AddAasmIndexes < ActiveRecord::Migration[5.1]
  def change
    add_index :entries, :aasm_state
    add_index :customers, :aasm_state
    add_index :invoices, :aasm_state
    add_index :statements, :aasm_state
    add_index :vendors, :aasm_state
    add_index :batch_uploads, :aasm_state
  end
end
