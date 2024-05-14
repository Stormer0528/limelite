class InputObjects::CreditCardChargeUpdateAttributes < InputObjects::CreditCardChargeAttributes
  description "Attributes for creating or updating a Credit Card Payment"

  argument :id, ID, required: true
  argument :entry_attributes, InputObjects::EntryAttributes, required: true
end
