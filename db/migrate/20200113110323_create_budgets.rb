class CreateBudgets < ActiveRecord::Migration[5.1]
  def up
    create_table :budgets do |t|
      t.integer :fiscal_year
      t.references :account, foreign_key: true
      t.monetize :amount

      t.timestamps
    end
  end

  def down
    drop_table :budgets
  end
end
