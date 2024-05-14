class RemoveAccountTransfers < ActiveRecord::Migration[5.1]
  def change
    drop_table :account_transfers
  end
end
