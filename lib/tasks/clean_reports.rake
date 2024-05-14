namespace :clean_reports do
  desc "Clean reports"

  task clean_reports: :environment do
    Report::ApAgingReport.delete_all
    Report::ArAgingReport.delete_all
    Report::BalanceSheetByMonth.delete_all
    Report::BalanceSheetByResource.delete_all
    Report::BalanceSheet.delete_all
    Report::BudgetVsActualReport.delete_all
    Report::CashFlowReport.delete_all
    Report::ComparativeBalanceSheet.delete_all
    Report::ComparativeProfitAndLossStatement.delete_all
    Report::MonthlyCashFlowReport.delete_all
    Report::MonthlyProfitLossStatement.delete_all
    Report::ProfitAndLossByResourceReport.delete_all
    Report::ProfitAndLossStatement.delete_all
    Report::VendorReport.delete_all
    Report::Vendor1099Report.delete_all
  end
end
