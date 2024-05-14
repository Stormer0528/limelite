class AddAddressIdToBankAccountItems < ActiveRecord::Migration[5.1]
  def change
    add_reference :bank_account_items, :address, foreign_key: true
  end
end
