class Types::Report::CashFlowReport < Types::Report::ReportBase
  implements Interfaces::AccountSearchableInterface

  field :organization_name, String, null: true
  field :fiscal_year, String, null: true
  field :report_date, String, null: true

  field :reports, [Types::Report::CashFlowReportReport], null: true

  field :url, String, null: true
  field :pdf_url, String, null: true
  field :xlsx_url, String, null: true

  def organization_name
    context[:current_org].name
  end

  def reports
    object.data["reports"]
  end

  def url
    "/export/cash-flow-report/#{object.id}"
  end

  def pdf_url
    "#{url}.pdf"
  end

  def xlsx_url
    "#{url}.xlsx"
  end
end
