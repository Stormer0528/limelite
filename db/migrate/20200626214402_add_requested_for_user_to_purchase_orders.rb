class AddRequestedForUserToPurchaseOrders < ActiveRecord::Migration[5.1]
  def change
    remove_column :purchase_orders, :requested_by, :string
    remove_column :purchase_orders, :requested_for, :string

    add_reference :purchase_orders, :requested_by, foreign_key: {to_table: :users}
    add_reference :purchase_orders, :requested_for, foreign_key: {to_table: :users}
  end
end
