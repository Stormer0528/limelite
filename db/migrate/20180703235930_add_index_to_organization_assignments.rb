class AddIndexToOrganizationAssignments < ActiveRecord::Migration[5.1]
  def change
    add_index :organization_assignments, [:organization_id, :user_id]
  end
end
