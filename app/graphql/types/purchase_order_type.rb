class Types::PurchaseOrderType < Types::BaseObject
  include Concerns::Permissable
  include Concerns::ApprovableWithLog
  include Concerns::Authorizations

  implements Interfaces::ValidatableInterface

  field :id, ID, null: true
  field :vendor_id, ID, null: false
  field :number, String, null: true
  field :date, String, null: true
  field :date_needed, String, null: true
  field :buyer, String, null: true
  field :requisition_number, String, null: true
  field :reference_number, String, null: true
  field :slug, String, null: true
  field :file_url, String, null: true
  field :aasm_state, String, null: true
  field :payment_terms, String, null: true
  field :reference_number, String, null: true

  field :requested_by_id, ID, null: true
  field :requested_for_id, ID, null: true

  field :requested_by_name, String, null: true
  field :requested_for_name, String, null: true

  field :requested_by, Types::UserType, null: true
  field :requested_for, Types::UserType, null: true

  field :quote_date, String, null: true
  field :quote_number, String, null: true
  field :proposal_date, String, null: true
  field :proposal_number, String, null: true

  field :vendor, Types::Vendor, null: true
  field :vendor_name, String, null: true
  field :vendor_path, String, null: true
  field :vendor_slug, String, null: true

  field :invoice_id, ID, null: true
  field :invoice, Types::InvoiceType, null: true
  field :invoice_number, String, null: true
  field :invoice_date, String, null: true
  field :invoice_due_date, String, null: true
  field :invoice_amount, String, null: true
  field :invoice_description, String, null: true
  field :invoice_amount_remaining, String, null: true
  field :invoice_path, String, null: true
  field :add_invoice_path, String, null: true

  field :address_id, ID, null: true
  field :address, Types::AddressType, null: true

  field :vendor_address_id, ID, null: true
  field :vendor_address, Types::AddressType, null: true

  field :purchase_order_items, [Types::PurchaseOrderItemType, {null: true}], null: true

  field :subtotal, String, null: true
  field :total,    String, null: true

  field :subtotal_in_cents, Integer, null: true
  field :total_in_cents,    Integer, null: true

  field :tax_amount,      String, null: true
  field :shipping_amount, String, null: true

  field :tax_amount_in_cents,      Integer, null: true
  field :shipping_amount_in_cents, Integer, null: true

  field :created_at, String, null: true
  field :updated_at, String, null: true

  field :path,        String, null: true
  field :edit_path,   String, null: true
  field :export_path, String, null: true

  def paid
    object.paid?
  end

  def path
    return nil unless object.vendor

    "#{vendor_path}/purchase_orders/#{object.slug}"
  end

  def vendor_name
    if object.respond_to?(:vendor)
      object&.vendor&.full_name
    else
      ""
    end
  end

  def vendor_path
    return nil unless object.vendor

    "/vendors/#{object.vendor&.slug}"
  end

  def vendor_slug
    object&.vendor.slug
  end

  def invoice_path
    return nil unless object.vendor && object.invoice

    "#{vendor_path}/invoices/#{object.invoice&.slug}"
  end

  def edit_path
    return nil unless object.vendor

    "#{path}/edit"
  end

  def export_path
    return nil unless object.vendor

    "/export#{path}.pdf"
  end

  def subtotal
    object.subtotal&.format
  end

  def total
    object.total&.format
  end

  def subtotal_in_cents
    object.subtotal.cents
  end

  def total_in_cents
    object.total.cents
  end

  def tax_amount
    object.tax_amount&.format
  end

  def shipping_amount
    object.shipping_amount&.format
  end

  def tax_amount_in_cents
    object.tax_amount.cents
  end

  def shipping_amount_in_cents
    object.shipping_amount.cents
  end

  # def authorization_path_index
  #   return object.authorization_path&.length if object.authorized?
  #   return nil if object.aasm_state != "needs_approval"

  #   object.authorization_path&.find_index {|group| group&.id == object.current_auth_group&.id } || 0
  # end

  def requested_by_name
    object.requested_by&.full_name
  end

  def requested_for_name
    object.requested_for&.full_name
  end
end
