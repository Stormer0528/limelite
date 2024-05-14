class CreateAccountYears < ActiveRecord::Migration[5.0]
  def change
    create_table :account_years do |t|
      t.string :name
      t.integer :code
      t.references :organization, foreign_key: true

      t.timestamps
    end
    add_index :account_years, :code
  end
end
