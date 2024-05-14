class CreateUserGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :user_groups do |t|
      t.string :name
      t.references :parent, table_name: :user_groups, foreign_key: {to_table: :user_groups}
      t.references :organization, foreign_key: true

      t.timestamps
    end
  end
end
