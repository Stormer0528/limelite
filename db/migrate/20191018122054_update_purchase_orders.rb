class UpdatePurchaseOrders < ActiveRecord::Migration[5.1]
  def change
    change_table :purchase_orders do |t|
      t.date :quote_date
      t.date :proposal_date
      t.string :quote_number
      t.string :proposal_number
      t.string :reference_number
      t.text :payment_terms

      t.references :address, foreign_key: true
      t.references :vendor_address, table_name: :address, foreign_key: {to_table: :addresses}

      t.monetize :tax_amount
      t.monetize :shipping_amount
    end

    remove_column :purchase_orders, :status, :string
  end
end
