class RemoveMoreReportColumns < ActiveRecord::Migration[5.1]
  def change
    remove_column :report_balance_sheets, :account_fund_id
    remove_column :report_budget_vs_actual_reports, :slug
  end
end
