class UpdatePurchaseOrdersAgain < ActiveRecord::Migration[5.1]
  def change
    change_table :purchase_orders do |t|
      t.references :creator, table_name: :users, foreign_key: {to_table: :users}
    end

    add_column    :purchase_orders, :date, :date

    remove_column :purchase_order_items, :purchase_order_item_id, :bigint
    add_column    :purchase_order_items, :order, :integer, default: 0
  end
end
