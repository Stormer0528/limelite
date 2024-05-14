class CreateAccountGoals < ActiveRecord::Migration[5.0]
  def change
    create_table :account_goals do |t|
      t.string :name
      t.integer :code
      t.references :organization, foreign_key: true

      t.timestamps
    end
    add_index :account_goals, :code
  end
end
