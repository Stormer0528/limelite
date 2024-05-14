class AddFileUrlToVendors < ActiveRecord::Migration[5.1]
  def change
    add_column :vendors, :file_url, :string
  end
end
