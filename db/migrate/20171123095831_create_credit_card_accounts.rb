class CreateCreditCards < ActiveRecord::Migration[5.1]
  def change
    create_table :credit_cards do |t|
      t.string :name
      t.string :number, limit: 4
      t.string :description
      t.monetize :starting_balance
      t.date :started_at
      t.date :ended_at
      t.references :organization

      t.timestamps
    end
  end
end
