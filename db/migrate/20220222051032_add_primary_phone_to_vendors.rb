class AddPrimaryPhoneToVendors < ActiveRecord::Migration[5.2]
  def change
    add_column :vendors, :primary_phone, :string
  end
end
