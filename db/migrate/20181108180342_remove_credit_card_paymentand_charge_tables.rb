class RemoveCreditCardPaymentandChargeTables < ActiveRecord::Migration[5.1]
  def up
    drop_table :credit_card_charges
    drop_table :credit_card_payments
  end

  def down
  end
end
