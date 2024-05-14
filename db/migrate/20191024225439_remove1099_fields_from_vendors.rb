class Remove1099FieldsFromVendors < ActiveRecord::Migration[5.1]
  def up
    remove_column :vendors, :ein
    remove_column :vendors, :ein_type
    remove_column :vendors, :ten_ninety_nine
    remove_column :vendors, :ten_ninety_nine_address_id
  end

  def down
    add_column :vendors, :ein, :string
    add_column :vendors, :ein_type, :string
    add_column :vendors, :ten_ninety_nine, :boolean
    add_column :vendors, :ten_ninety_nine_address_id, :int
  end
end
