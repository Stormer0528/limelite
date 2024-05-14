class Types::Report::VendorReportItem < Types::Report::ReportBase
  field :code, String, null: true
  field :vendor_name, String, null: true
  field :vendor_number, String, null: true
  field :amount, String, null: true
  field :phone, String, null: true
  field :address, Types::AddressType, null: true
end
