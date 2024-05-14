class UpdateDataFields < ActiveRecord::Migration[5.1]
  def change
    change_column_default :profit_and_loss_by_resource, :data, {}
    change_column_default :report_balance_sheets, :data, {}
    change_column_default :report_budget_vs_actual_reports, :data, {}
    change_column_default :report_monthly_profit_loss_statements, :data, {}
    change_column_default :report_profit_and_loss_statements, :data, {}
    change_column_default :report_vendor_reports, :data, {}
    change_column_default :report_vendor1099_reports, :data, {}
  end
end
