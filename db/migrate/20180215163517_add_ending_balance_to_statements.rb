class AddEndingBalanceToStatements < ActiveRecord::Migration[5.1]
  def change
    add_monetize :statements, :starting_balance
    add_monetize :statements, :ending_balance
    add_monetize :statements, :adjustment_amount
    add_column   :statements, :adjustment_date, :date
  end
end
