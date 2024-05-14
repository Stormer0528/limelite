class AddAccountIdToCreditCards < ActiveRecord::Migration[5.1]
  def change
    add_reference :credit_card_charges,  :account, foreign_key: true
    add_reference :credit_card_payments, :account, foreign_key: true
  end
end
