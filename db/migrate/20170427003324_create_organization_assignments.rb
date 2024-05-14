class CreateOrganizationAssignments < ActiveRecord::Migration[5.0]
  def change
    create_table :organization_assignments do |t|
      t.references :user, foreign_key: true
      t.references :organization, foreign_key: true
      t.string :type

      t.timestamps
    end
  end
end
