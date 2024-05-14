class DropPayeeFromBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :bank_account_items, :payee
  end
end
