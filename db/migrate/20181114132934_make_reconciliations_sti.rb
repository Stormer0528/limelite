class MakeReconciliationsSti < ActiveRecord::Migration[5.1]
  def change
    rename_column :reconciliations, :bank_account_item_id, :reconcilable_item_id
    add_column :reconciliations, :reconcilable_item_type, :string

    rename_column :reconciliations, :bank_account_id, :reconcilable_id
    add_column :reconciliations, :reconcilable_type, :string

    rename_column :statements, :reconcilable_type, :statementable_type
    rename_column :statements, :reconcilable_id, :statementable_id

    Reconciliation.find_each do |rec|
      rec.update! reconcilable_item_type: "BankAccount::Item", reconcilable_type: "BankAccount"
    end
  end
end
