class InputObjects::EntryItemAttributes < Types::BaseInputObject
  description "Properties for creating a EntryItem"

  argument :amount,       Float, required: true
  argument :type,         String, required: true
  argument :memo,         String, required: false
  argument :payable_id,   ID, required: false
  argument :payable_type, String, required: false

  argument :account_id, ID, required: false
  argument :id, ID,         required: false
end
