class AddAliasToOrganization < ActiveRecord::Migration[5.1]
  def change
    add_column :organizations, :alias, :string
    add_index :organizations, :alias
  end
end
