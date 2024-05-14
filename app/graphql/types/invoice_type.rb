class Types::InvoiceType < Types::BaseObject
  include Concerns::Permissable

  field :id, ID, null: true
  field :aasm_state, String, null: true
  field :amount_paid, String, null: false
  field :amount_remaining, String, null: false
  field :amount, String, null: false
  field :date, String, null: true
  field :description, String, null: true
  field :notes, String, null: true
  field :display_label, String, null: true
  field :due_date, String, null: true
  field :file_url, String, null: true
  field :invoiceable_id, ID, null: true
  field :invoiceable_type, String, null: true
  field :invoiceable, Unions::InvoiceableUnion, null: true
  field :number, String, null: true
  field :slug, String, null: true
  field :vendor_name, String, null: true
  field :creator, Types::UserType, null: true

  field :payments,       [Types::PaymentType],     null: true
  field :checks,         [Types::CheckType],       null: true
  field :vendor,         Types::Vendor,            null: true
  field :customer,       Types::CustomerType,      null: true
  field :purchase_order, Types::PurchaseOrderType, null: true

  field :created_at, String, null: true
  field :updated_at, String, null: true
  field :paid, Boolean, null: false

  field :path, String, null: false
  field :edit_path, String, null: false

  field :address_type, String, null: true
  field :address_text, String, null: true
  field :account_object, String, null: true

  def address_type
    if object.address.nil?
      addresses = object.vendor.addresses
      addresses.length() > 0 ? addresses[0].name : ''
    else
      object.address.name
    end
  end

  def address_text
    if object.address.nil?
      addresses = object.vendor.addresses
      addresses.length() > 0 ? addresses[0].to_text : ''
    else
      object.address.to_text
    end
  end

  def account_object
    if object.account_object.nil?
      account_objects = context[:current_org].account_objects.with_bank_account
      account_objects.length() > 0 ? account_objects[0].display_name : ''
    else
      object.account_object.display_name
    end
  end

  def paid
    object.paid?
  end

  def amount
    object.amount.format
  end

  def amount_paid
    object.amount_paid.format
  end

  def amount_remaining
    object.amount_remaining.format
  end

  def path
    "/#{object.invoiceable_type.tableize}/#{object.invoiceable.slug}/invoices/#{object.slug}"
  end

  def edit_path
    "/#{object.invoiceable_type.tableize}/#{object.invoiceable.slug}/invoices/#{object.slug}/edit"
  end

  def vendor_name
    object&.vendor&.full_name
  end

  def date
    object&.date&.to_formatted_s(:std_alt)
  end
end
