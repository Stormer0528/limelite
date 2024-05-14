class ChangeReportBudgetVsActualsReportDataFieldToJsonb < ActiveRecord::Migration[5.1]
  def change
    execute <<-SQL
    ALTER TABLE report_budget_vs_actual_reports
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    SQL
  end
end
