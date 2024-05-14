class InputObjects::EntryAttributes < Types::BaseInputObject
  description "Attributes for creating or updating an Entry"

  argument :id, ID,              required: false
  argument :date, String,        required: false
  argument :entry_type, String,  required: true
  argument :entry_items_attributes, [InputObjects::EntryItemAttributes], required: false
end
