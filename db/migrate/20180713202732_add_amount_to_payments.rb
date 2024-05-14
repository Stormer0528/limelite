class AddAmountToPayments < ActiveRecord::Migration[5.1]
  def change
    add_column :payments, :amount_in_cents, :integer, default: 0
  end
end
