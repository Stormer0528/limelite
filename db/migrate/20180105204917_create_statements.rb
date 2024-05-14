class CreateStatements < ActiveRecord::Migration[5.1]
  def change
    create_table :statements do |t|
      t.references :organization, foreign_key: true
      t.references :bank_account, foreign_key: true
      t.date :started_at
      t.date :ended_at

      t.timestamps
    end
  end
end
