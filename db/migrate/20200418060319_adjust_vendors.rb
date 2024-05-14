class AdjustVendors < ActiveRecord::Migration[5.1]
  def change
    remove_index :vendors, :company
    remove_index :vendors, :first_name
    add_index :vendors, [:company, :title, :first_name, :last_name, :suffix],
      name: "index_vendors_on_name"
  end
end
