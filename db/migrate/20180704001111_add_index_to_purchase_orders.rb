class AddIndexToPurchaseOrders < ActiveRecord::Migration[5.1]
  def change
    add_index :purchase_orders, [:invoice_id, :vendor_id]
  end
end
