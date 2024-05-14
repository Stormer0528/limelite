class Types::Report::ArAgingReport < Types::Report::ReportBase
  # field :aging_method, String, null: true
  field :customers_by_period, String, null: true
  field :periods_by_customer, String, null: true

  field :periods, Int, null: true
  field :days_per_period, Int, null: false
  field :show_active_columns, Boolean, null: true
  field :show_active_rows, Boolean, null: true
  field :period_names, [String], null: true

  field :url, String, null: true
  field :pdf_url, String, null: true
  field :xlsx_url, String, null: true

  def data
    object.data.to_json
  end

  def url
    "/export/ar-aging-report/#{object.id}"
  end

  def pdf_url
    "#{url}.pdf"
  end

  def xlsx_url
    "#{url}.xlsx"
  end

  def customers_by_period
    (object.data["customers_by_period"] || {}).to_json
  end

  def periods_by_customer
    (object.data["periods_by_customer"] || {}).to_json
  end
end
