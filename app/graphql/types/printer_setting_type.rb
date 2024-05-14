class Types::PrinterSettingType < Types::BaseObject
  field :id, ID, null: true
  field :organization_id, ID, null: false
  field :name, String, null: true
  field :slug, String, null: true
  field :printer_type, String, null: true

  # Offsets
  field :payee_offset_x, Integer, null: true
  field :payee_offset_y, Integer, null: true
  field :date_offset_x, Integer, null: true
  field :date_offset_y, Integer, null: true
  field :amount_offset_x, Integer, null: true
  field :amount_offset_y, Integer, null: true
  field :memo_offset_x, Integer, null: true
  field :memo_offset_y, Integer, null: true
  field :signature_offset_x, Integer, null: true
  field :signature_offset_y, Integer, null: true
  field :amount_text_offset_x, Integer, null: true
  field :amount_text_offset_y, Integer, null: true
  field :check_margin, Integer, null: true

  field :micr_offset_x, Integer, null: true
  field :micr_offset_y, Integer, null: true
  field :voucher1_offset_y, Integer, null: true
  field :voucher2_offset_y, Integer, null: true
  field :invoice_no_x, Integer, null: true
  field :invoice_no_y, Integer, null: true
  field :invoice_date_x, Integer, null: true
  field :invoice_date_y, Integer, null: true
  field :invoice_amount_x, Integer, null: true
  field :invoice_amount_y, Integer, null: true
  field :invoice_amount_paid_x, Integer, null: true
  field :invoice_amount_paid_y, Integer, null: true
  field :invoice_description_x, Integer, null: true
  field :invoice_description_y, Integer, null: true

  field :created_at, String, null: false
  field :updated_at, String, null: false
end
