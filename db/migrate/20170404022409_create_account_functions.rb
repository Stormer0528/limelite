class CreateAccountFunctions < ActiveRecord::Migration[5.0]
  def change
    create_table :account_functions do |t|
      t.string :name
      t.integer :code
      t.references :organization, foreign_key: true

      t.timestamps
    end
    add_index :account_functions, :code
  end
end
