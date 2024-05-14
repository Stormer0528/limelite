class AddUniqueIndexToOrganizations < ActiveRecord::Migration[5.1]
  def change
    remove_index :organizations, :subdomain
    add_index :organizations, :name, unique: true
    add_index :organizations, :subdomain, unique: true
  end
end
