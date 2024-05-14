class Types::Report::Vendor1099ReportItem < Types::Report::ReportBase
  field :name, String, null: true
  field :address, String, null: true
  field :ssn_ein, String, null: true
  field :type, String, null: true
  field :year_amount, String, null: true
end
