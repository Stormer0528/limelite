class AddOrganizationIdToVendor < ActiveRecord::Migration[5.0]
  def change
    add_reference :vendors, :organization, foreign_key: true
  end
end
