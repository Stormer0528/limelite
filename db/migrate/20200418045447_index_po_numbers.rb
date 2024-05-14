class IndexPoNumbers < ActiveRecord::Migration[5.1]
  def change
    add_index :purchase_orders, [:number, :vendor_id], unique: true
  end
end
