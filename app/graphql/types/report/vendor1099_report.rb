class Types::Report::Vendor1099Report < Types::Report::ReportBase
  field :vendors, [Types::Report::Vendor1099ReportItem], null: true
  field :organization_name, String, null: false

  field :url, String, null: true
  field :pdf_url, String, null: true
  field :xlsx_url, String, null: true

  def organization_name
    context[:current_org]&.name
  end

  def url
    "/export/vendor-1099-report/#{object.id}"
  end

  def pdf_url
    "#{url}.pdf"
  end

  def xlsx_url
    "#{url}.xlsx"
  end
end
