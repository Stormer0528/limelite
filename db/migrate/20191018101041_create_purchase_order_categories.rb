class CreatePurchaseOrderCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :purchase_order_categories do |t|
      t.string :name
      t.references :purchase_order, foreign_key: true

      t.timestamps
    end

    change_table :purchase_order_items do |t|
      t.references :purchase_order_item, foreign_key: true
    end
  end
end
