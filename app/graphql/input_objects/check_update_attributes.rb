class InputObjects::CheckUpdateAttributes < InputObjects::CheckAttributes
  description "Attributes for updating a Bank Account Check"

  argument :id,              ID,      required: true

  argument :bank_account_id, ID,      required: true
  argument :entry_attributes, InputObjects::EntryAttributes, required: true
end
