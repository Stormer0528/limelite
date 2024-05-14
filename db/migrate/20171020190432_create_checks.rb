class CreateChecks < ActiveRecord::Migration[5.1]
  def change
    create_table :checks do |t|
      t.references :account, foreign_key: true
      t.monetize :amount
      t.date :date
      t.text :memo
      t.string :payee
      t.string :number
      t.integer :creator_id, column: :users, foreign_key: true

      t.timestamps
    end
  end
end
