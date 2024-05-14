class CreateDepartments < ActiveRecord::Migration[5.1]
  def change
    create_table :departments do |t|
      t.string :name
      t.references :organization, foreign_key: true
      t.references :account, foreign_key: true

      t.timestamps
    end

    add_reference :users, :department, foreign_key: true
  end
end
