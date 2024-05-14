class AddAddressToPayments < ActiveRecord::Migration[5.1]
  def change
    add_reference :payments, :address, foreign_key: true
  end
end
