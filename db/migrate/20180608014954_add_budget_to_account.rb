class AddBudgetToAccount < ActiveRecord::Migration[5.1]
  def change
    add_monetize :accounts, :budget
  end
end
