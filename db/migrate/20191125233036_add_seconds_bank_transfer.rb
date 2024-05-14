class AddSecondsBankTransfer < ActiveRecord::Migration[5.1]
  def change
    remove_reference :bank_account_items, :from_bank_account
  end
end
