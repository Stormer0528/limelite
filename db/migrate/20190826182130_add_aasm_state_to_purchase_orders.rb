class AddAasmStateToPurchaseOrders < ActiveRecord::Migration[5.1]
  def change
    add_column :purchase_orders, :aasm_state, :string
  end
end
