class CreateUserSchoolAssignments < ActiveRecord::Migration[5.2]
  def change
    create_table :user_school_assignments do |t|
      t.references :user, foreign_key: true
      t.references :organization, foreign_key: true
      t.references :account_fund, foreign_key: true

      t.timestamps
    end
  end
end
