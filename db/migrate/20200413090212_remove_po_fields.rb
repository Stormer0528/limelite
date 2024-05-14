class RemovePoFields < ActiveRecord::Migration[5.1]
  def change
    remove_column :purchase_orders, :blanket, :boolean
    remove_column :purchase_orders, :stock_po, :boolean
  end
end
