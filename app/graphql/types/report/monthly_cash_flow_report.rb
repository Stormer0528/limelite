class Types::Report::MonthlyCashFlowReport < Types::Report::ReportBase
  implements Interfaces::AccountSearchableInterface

  # field :account_search_params, String, null: true
  field :organization_name, String, null: true
  field :cash_at_beginning, [String], null: true
  field :cash_at_end, [String], null: true
  field :financing_activities, [Types::Report::AccountBalanceObjectType], null: true
  field :financing_activities_total, [String], null: true
  field :fiscal_year, String, null: true
  field :investigating_activities, [Types::Report::AccountBalanceObjectType], null: true
  field :investing_activities, [Types::Report::AccountBalanceObjectType], null: true
  field :investing_activities_total, [String], null: true
  field :net_cash, [String], null: true
  field :net_cash_increase, [String], null: true
  field :net_income, [String], null: true
  field :net_operations_cash, [String], null: true
  field :other_income, [Types::Report::AccountBalanceObjectType], null: true
  field :other_income_total, [String], null: true
  field :report_date, String, null: true

  field :months, [String], null: true
  field :month_titles, [String], null: true
  field :colspan_width, Integer, null: true

  field :url, String, null: true
  field :pdf_url, String, null: true
  field :xlsx_url, String, null: true

  def organization_name
    context[:current_org].name
  end

  def financing_activities
    object.data["financing_activities"]
  end

  def investing_activities
    object.data["investing_activities"]
  end

  def investigating_activities
    object.data["investigating_activities"]
  end

  def other_income
    object.data["other_income"]
  end

  def url
    "/export/monthly-cash-flow-report/#{object.id}"
  end

  def pdf_url
    "#{url}.pdf"
  end

  def xlsx_url
    "#{url}.xlsx"
  end
end
