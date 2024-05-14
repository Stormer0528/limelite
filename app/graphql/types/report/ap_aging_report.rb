class Types::Report::ApAgingReport < Types::Report::ReportBase
  field :data, String, null: false
  # field :aging_method, String, null: true
  field :periods, Int, null: true
  field :days_per_period, Int, null: false
  field :show_active_columns, Boolean, null: true
  field :show_active_rows, Boolean, null: true
  field :period_names, [String], null: true
  field :vendors_by_period, String, null: true
  field :periods_by_vendor, String, null: true

  field :url, String, null: true
  field :pdf_url, String, null: true
  field :xlsx_url, String, null: true

  def data
    object.data.to_json
  end

  def url
    "/export/ap-aging-report/#{object.id}"
  end

  def pdf_url
    "#{url}.pdf"
  end

  def xlsx_url
    "#{url}.xlsx"
  end

  def vendors_by_period
    (object.data["vendors_by_period"] || {}).to_json
  end

  def periods_by_vendor
    (object.data["periods_by_vendor"] || {}).to_json
  end
end
