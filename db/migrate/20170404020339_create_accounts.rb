class CreateAccounts < ActiveRecord::Migration[5.0]
  def change
    create_table :accounts do |t|
      t.references :organization, foreign_key: true
      t.string :pseudo
      t.string :name
      t.string :owner
      t.string :description
      t.string :state_account_number
      t.boolean :restriced
      t.string :county_account_number
      t.datetime :start_date
      t.datetime :end_date

      t.timestamps
    end
  end
end
