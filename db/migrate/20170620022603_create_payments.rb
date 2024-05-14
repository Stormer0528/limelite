class CreatePayments < ActiveRecord::Migration[5.0]
  def change
    create_table :payments do |t|
      t.references :vendor, foreign_key: true
      t.references :invoice, foreign_key: true
      t.references :purchase_order, foreign_key: true
      t.boolean :final_pay
      t.integer :amount_in_cents, default: 0
      t.date :date
      t.integer :tax_amount_in_cents, default: 0
      t.integer :shipping_amount_in_cents, default: 0

      t.timestamps
    end
  end
end
