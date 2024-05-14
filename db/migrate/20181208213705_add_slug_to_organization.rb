class AddSlugToOrganization < ActiveRecord::Migration[5.1]
  def change
    add_column :organizations, :slug, :string
    add_column :users, :slug, :string

    add_index :organizations, :slug
    add_index :users, :slug

    Organization.find_each(&:save)
    User.find_each(&:save)
  end
end
