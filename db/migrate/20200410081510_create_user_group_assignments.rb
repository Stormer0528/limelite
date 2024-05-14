class CreateUserGroupAssignments < ActiveRecord::Migration[5.1]
  def change
    create_table :user_group_assignments do |t|
      t.references :user_group, foreign_key: true
      t.references :user, foreign_key: true
      t.references :organization, foreign_key: true

      t.timestamps
    end

    add_index :user_group_assignments, [:organization_id, :user_id, :user_group_id], name: :org_user_group_assignments
  end
end
