class Types::Report::CashFlowReportReport < Types::Report::ReportBase
  field :fund, Types::Account::AccountFund, null: true
  field :cash_at_beginning, String, null: true
  field :cash_at_end, String, null: true
  field :investigating_activities, [Types::Report::AccountBalanceObjectType], null: true
  field :investing_activities, [Types::Report::AccountBalanceObjectType], null: true
  field :investing_activities_total, String, null: true
  field :net_cash, String, null: true
  field :net_cash_increase, String, null: true
  field :net_income, String, null: true
  field :net_operations_cash, String, null: true
  field :other_income, [Types::Report::AccountBalanceObjectType], null: true
  field :other_income_total, String, null: true
  field :financing_activities, [Types::Report::AccountBalanceObjectType], null: true
  field :financing_activities_total, String, null: true
end
