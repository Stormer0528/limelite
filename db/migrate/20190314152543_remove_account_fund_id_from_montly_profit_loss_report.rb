class RemoveAccountFundIdFromMontlyProfitLossReport < ActiveRecord::Migration[5.1]
  def change
    remove_reference :report_monthly_profit_loss_reports, :account_fund
    remove_column :report_monthly_profit_loss_reports, :slug

    rename_table :report_monthly_profit_loss_reports, :report_monthly_profit_loss_statements
  end
end
