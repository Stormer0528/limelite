class RemoveForeignKeysFromReconciliations < ActiveRecord::Migration[5.1]
  def change
    remove_foreign_key :reconciliations, :bank_accounts
    remove_foreign_key :reconciliations, :bank_account_items
  end
end
