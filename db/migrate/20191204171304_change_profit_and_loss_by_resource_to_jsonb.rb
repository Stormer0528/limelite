class ChangeProfitAndLossByResourceToJsonb < ActiveRecord::Migration[5.1]
  def change
    execute <<-SQL
    ALTER TABLE profit_and_loss_by_resource
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    SQL
  end
end
