class InputObjects::DepositUpdateAttributes < InputObjects::DepositAttributes
  description "Attributes for updating a Bank Account Deposit"

  argument :id, ID, required: true
  argument :entry_attributes, InputObjects::EntryAttributes, required: true
end
