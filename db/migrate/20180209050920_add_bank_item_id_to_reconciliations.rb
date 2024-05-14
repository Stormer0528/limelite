class AddBankItemIdToReconciliations < ActiveRecord::Migration[5.1]
  def change
    add_reference :reconciliations, :bank_account_item, foreign_key: true
  end
end
