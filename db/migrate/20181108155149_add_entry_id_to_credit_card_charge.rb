class AddEntryIdToCreditCardCharge < ActiveRecord::Migration[5.1]
  def change
    add_reference :credit_card_charges, :entry, foreign_key: true
    add_reference :credit_card_payments, :entry, foreign_key: true
  end
end
