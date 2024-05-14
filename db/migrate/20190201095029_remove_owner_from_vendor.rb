class RemoveOwnerFromVendor < ActiveRecord::Migration[5.1]
  def change
    remove_column :vendors, :owner
    remove_column :vendors, :county_number
    remove_column :vendors, :do_not_use
  end
end
