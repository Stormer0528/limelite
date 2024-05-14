class CreateCreditCardPayments < ActiveRecord::Migration[5.1]
  def change
    create_table :credit_card_payments do |t|
      t.references :credit_card, foreign_key: true
      t.monetize :amount
      t.date :date
      t.text :memo

      t.timestamps
    end
  end
end
