class InputObjects::AccountTransferAttributes < Types::BaseInputObject
  description "Attributes for creating or updating a Bank Account Transfer"

  argument :date,              String,  required: false
  argument :file_url,          String,  required: false
  argument :memo,              String,  required: false

  argument :bank_account_id, ID, required: true
  argument :entry_attributes, InputObjects::EntryAttributes, required: false
end
