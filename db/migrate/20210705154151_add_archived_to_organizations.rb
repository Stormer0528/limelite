class AddArchivedToOrganizations < ActiveRecord::Migration[5.2]
  def change
    add_column :organizations, :archived, :boolean
    add_index :organizations, :archived
  end
end
