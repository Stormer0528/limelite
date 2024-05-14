class InputObjects::CreditCardPaymentAttributes < Types::BaseInputObject
  description "Attributes for creating or updating a Credit Card Payment"

  argument :file_url,        String,  required: false
  argument :memo,            String,  required: false
  argument :number,          String,  required: false

  argument :credit_card_id, ID,      required: true
  argument :entry_attributes, InputObjects::EntryAttributes, required: false
end
