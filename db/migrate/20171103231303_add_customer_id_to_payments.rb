class AddCustomerIdToPayments < ActiveRecord::Migration[5.1]
  def change
    add_reference :payments, :customer, foreign_key: true
  end
end
