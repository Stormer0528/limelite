class RemoveAccountReconciliationsAndReconciliaitonItems < ActiveRecord::Migration[5.1]
  def change
    drop_table :account_reconciliation_items
    drop_table :account_reconciliations
  end
end
