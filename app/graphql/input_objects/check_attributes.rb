class InputObjects::CheckAttributes < Types::BaseInputObject
  description "Attributes for creating or updating a Bank Account Check"

  argument :date,            String,  required: false
  argument :file_url,        String,  required: false
  argument :memo,            String,  required: false
  argument :printed,         Boolean, required: false
  argument :check_type,      String,  required: false
  argument :number,          String,  required: false

  argument :address_id, ID,           required: false
  argument :bank_account_id, ID,      required: true
  argument :entry_attributes, InputObjects::EntryAttributes, required: false
end
