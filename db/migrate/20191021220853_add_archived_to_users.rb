class AddArchivedToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :archived, :boolean
  end
end
