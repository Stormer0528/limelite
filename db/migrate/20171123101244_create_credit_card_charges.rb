class CreateCreditCardCharges < ActiveRecord::Migration[5.1]
  def change
    create_table :credit_card_charges do |t|
      t.references :credit_card, foreign_key: true
      t.string :description
      t.date :date
      t.monetize :amount
      t.monetize :tax_amount
      t.references :vendor, foreign_key: true

      t.timestamps
    end
  end
end
