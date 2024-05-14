class CreateSchoolAssignments < ActiveRecord::Migration[5.0]
  def change
    create_table :school_assignments do |t|
      t.references :user, foreign_key: true
      t.references :school, foreign_key: true
      t.string :type

      t.timestamps
    end
  end
end
