class InputObjects::AccountTransferUpdateAttributes < InputObjects::AccountTransferAttributes
  description "Attributes for updating a Bank Account Deposit"

  argument :id, ID, required: true
  argument :entry_attributes, InputObjects::EntryAttributes, required: true
end
