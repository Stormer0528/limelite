class InputObjects::CreditCardPaymentUpdateAttributes < InputObjects::CreditCardPaymentAttributes
  description "Attributes for creating or updating a Credit Card Payment"

  argument :id, ID, required: true
  argument :credit_card_id, ID, required: true
  argument :entry_attributes, InputObjects::EntryAttributes, required: true
end
