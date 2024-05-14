class RemoveDepositsAndChecks < ActiveRecord::Migration[5.1]
  def change
    drop_table :deposits
    drop_table :checks
  end
end
