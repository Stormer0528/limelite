class InputObjects::InvoiceAttributes < Types::BaseInputObject
  description "Attributes for creating or updating an Invoice"

  argument :id,               Integer,  required: false
  argument :number,           String,   required: false
  argument :date,             String,   required: false
  argument :description,      String,   required: false
  argument :due_date,         String,   required: false
  argument :invoiceable_type, String,   required: false
  argument :invoiceable_id,   ID,       required: false
  argument :file_url,         String,   required: false
  argument :aasm_state,       String,   required: false
  argument :paid,             Boolean,  required: false
end
