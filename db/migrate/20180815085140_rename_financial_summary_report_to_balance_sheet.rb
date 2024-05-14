class RenameFinancialSummaryReportToBalanceSheet < ActiveRecord::Migration[5.1]
  def change
    rename_table :report_financial_summary_reports, :report_balance_sheets
  end
end
