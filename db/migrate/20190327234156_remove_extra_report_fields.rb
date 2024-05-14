class RemoveExtraReportFields < ActiveRecord::Migration[5.1]
  def change
    remove_column :report_ap_aging_reports, :name, :string
    remove_column :report_ap_aging_reports, :subtitle, :string
    remove_column :report_ap_aging_reports, :status, :string
    remove_column :report_ap_aging_reports, :notes, :text
    remove_column :report_ap_aging_reports, :slug, :string

    remove_column :report_ar_aging_reports, :name, :string
    remove_column :report_ar_aging_reports, :subtitle, :string
    remove_column :report_ar_aging_reports, :status, :string
    remove_column :report_ar_aging_reports, :notes, :text
    remove_column :report_ar_aging_reports, :slug, :string

    remove_column :report_balance_sheets, :name, :string
    remove_column :report_balance_sheets, :subtitle, :string
    remove_column :report_balance_sheets, :status, :string
    remove_column :report_balance_sheets, :notes, :text
    remove_column :report_balance_sheets, :slug, :string

    remove_column :cash_flow_reports, :name, :string
    remove_column :cash_flow_reports, :subtitle, :string
    remove_column :cash_flow_reports, :status, :string
    remove_column :cash_flow_reports, :notes, :text
    remove_column :cash_flow_reports, :slug, :string

    rename_table :cash_flow_reports, :report_cash_flow_reports

    remove_column :report_monthly_cash_flow_reports, :name, :string
    remove_column :report_monthly_cash_flow_reports, :subtitle, :string
    remove_column :report_monthly_cash_flow_reports, :notes, :text
    remove_column :report_monthly_cash_flow_reports, :slug, :string

    remove_column :report_monthly_profit_loss_statements, :name, :string
    remove_column :report_monthly_profit_loss_statements, :subtitle, :string
    remove_column :report_monthly_profit_loss_statements, :notes, :text

    remove_column :report_profit_and_loss_statements, :name, :string
    remove_column :report_profit_and_loss_statements, :subtitle, :string
    remove_column :report_profit_and_loss_statements, :status, :string
    remove_column :report_profit_and_loss_statements, :notes, :text
    remove_column :report_profit_and_loss_statements, :slug, :string
  end
end
