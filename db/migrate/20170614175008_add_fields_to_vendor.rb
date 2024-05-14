class AddFieldsToVendor < ActiveRecord::Migration[5.0]
  def change
    add_column :vendors, :ein_type, :string
    add_column :vendors, :title, :string
    add_column :vendors, :first_name, :string
    add_column :vendors, :middle_name, :string
    add_column :vendors, :last_name, :string
    add_column :vendors, :suffix, :string
    remove_column :vendors, :name
  end
end
