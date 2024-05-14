class Add1099ToVendors < ActiveRecord::Migration[5.1]
  def change
    add_column :vendors, :ten_ninety_nine, :boolean, default: false
  end
end
