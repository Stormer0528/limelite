class CreatePurchaseOrderItems < ActiveRecord::Migration[5.1]
  def change
    create_table :purchase_order_items do |t|
      t.references :purchase_order, foreign_key: true
      t.integer :quantity, default: 0
      t.string :description
      t.monetize :price

      t.timestamps
    end
  end
end
