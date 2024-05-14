class AdjustReconciliationColumns < ActiveRecord::Migration[5.1]
  def change
    remove_column :reconciliations, :entry_id
    remove_index :reconciliations, :reconcilable_id
    remove_index :reconciliations, :reconcilable_item_id 
    add_index :reconciliations, [:reconcilable_id, :reconcilable_type],
      name: "index_reconciliations_on_reconcilable"
    add_index :reconciliations, [:reconcilable_item_id, :reconcilable_item_type],
      name: "index_reconciliations_on_reconcilable_item"
  end
end
