class AddArchivedFlagToUserGroups < ActiveRecord::Migration[5.2]
  def change
    add_column :user_groups, :archived, :boolean, default: false
  end
end
