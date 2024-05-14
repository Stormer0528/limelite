class RemovePaymentIdFromBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :bank_account_items, :payment_id
  end
end
