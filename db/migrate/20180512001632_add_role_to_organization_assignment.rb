class AddRoleToOrganizationAssignment < ActiveRecord::Migration[5.1]
  def change
    change_table :organization_assignments do |t|
      t.string :role, null: false, default: 'None'
      t.jsonb :permissions, null: false, default: {}

      t.index :permissions, using: :gin
    end
  end
end
