class Types::PaymentType < Types::BaseObject
  field :id, ID, null: true

  field :address_id, ID, null: true
  field :invoice_id, ID, null: true

  field :final_pay, Boolean, null: true
  field :date, String, null: true
  field :formatted_date, String, null: true

  field :amount, String, null: true
  field :amount_in_cents, Integer, null: true
  field :tax_amount_in_cents, Integer, null: true
  field :shipping_amount_in_cents, Integer, null: true

  field :file_url, String, null: true

  field :payable_id, ID, null: true
  field :payable_type, String, null: true

  field :path, String, null: true
  field :edit_path, String, null: true
  # field :payable, Unions::PayableUnion, null: true

  field :invoice, Types::InvoiceType, null: true
  field :check,   Types::CheckType,   null: true
  field :entry,   Types::EntryType,   null: true

  # field :purchase_order Types::PurchaseOrderType, null: true
  # field :address Types::AddressType, null: true

  field :created_at, String, null: true
  field :updated_at, String, null: true

  def amount
    object.amount.format
  end

  def path
    payable = object.payable.class.name.pluralize.downcase
    "/#{payable}/#{object.payable.slug}/payments/#{object.id}"
  end

  def edit_path
    "#{path}/edit"
  end

  def formatted_date
    object.date&.to_formatted_s(:std)
  end
end
