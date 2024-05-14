class UpdateMonthlyCashFlowReportName < ActiveRecord::Migration[5.1]
  def change
    rename_table :report_cash_flow_report_by_months, :report_monthly_cash_flow_reports
  end
end
