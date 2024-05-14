class RenameIncomeExpenseReportToProfitAndLossStatement < ActiveRecord::Migration[5.1]
  def change
     rename_table :report_income_expense_reports, :report_profit_and_loss_statements
  end
end
