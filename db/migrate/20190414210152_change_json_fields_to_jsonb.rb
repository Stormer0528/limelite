class ChangeJsonFieldsToJsonb < ActiveRecord::Migration[5.1]
  def change
    execute <<-SQL
    ALTER TABLE monthly_detail_reports
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    ALTER TABLE report_ap_aging_reports
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    ALTER TABLE report_ar_aging_reports
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    ALTER TABLE report_balance_sheets
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    ALTER TABLE report_cash_flow_reports
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    ALTER TABLE report_monthly_cash_flow_reports
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    ALTER TABLE report_monthly_profit_loss_statements
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    ALTER TABLE report_profit_and_loss_statements
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    ALTER TABLE report_vendor1099_reports
      ALTER COLUMN data
      SET DATA TYPE jsonb
      USING data::jsonb;
    SQL
  end
end
