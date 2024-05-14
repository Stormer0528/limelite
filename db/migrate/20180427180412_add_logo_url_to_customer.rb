class AddLogoUrlToCustomer < ActiveRecord::Migration[5.1]
  def change
    add_column :customers, :logo_url, :string
    add_column :vendors,   :logo_url, :string
    add_column :users, :avatar_url, :string
  end
end
