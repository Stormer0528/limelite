class InputObjects::PurchaseOrderAttributes < Types::BaseInputObject
  description "Attributes for creating a purchase order"

  argument :address_id,           ID,      required: false
  argument :invoice_id,           ID,      required: false
  argument :vendor_address_id,    ID,      required: false
  argument :vendor_id,            ID,      required: true
  argument :buyer,                String,  required: false
  argument :date_needed,          String,  required: false
  argument :date,                 String,  required: false
  argument :file_url,             String,  required: false
  argument :number,               String,  required: false
  argument :payment_terms,        String,  required: false
  argument :proposal_number,      String,  required: false
  argument :proposal_date,        String,  required: false
  argument :quote_date,           String,  required: false
  argument :quote_number,         String,  required: false
  argument :reference_number,     String,  required: false
  argument :requested_by_id,         ID,  required: false
  argument :requested_for_id,        ID,  required: false
  argument :requisition_number,   String,  required: false
  argument :status,               String,  required: false

  argument :tax_amount_in_cents,      Integer, required: false, default_value: 0
  argument :shipping_amount_in_cents, Integer, required: false, default_value: 0

  argument  :purchase_order_items_attributes,
            [InputObjects::PurchaseOrderItemAttributes],
            required: true
end
