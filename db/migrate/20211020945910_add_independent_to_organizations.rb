class AddIndependentToOrganizations < ActiveRecord::Migration[5.2]
  def change
    add_column :organizations, :independent, :boolean
    add_index :organizations, :independent
  end
end
