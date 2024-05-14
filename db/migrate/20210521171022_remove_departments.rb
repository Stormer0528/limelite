class RemoveDepartments < ActiveRecord::Migration[5.2]
  def up
    remove_reference :users, :department, foreign_key: true
    drop_table :departments
  end

  def down; end
end
