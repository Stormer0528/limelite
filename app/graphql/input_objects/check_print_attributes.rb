class InputObjects::CheckPrintAttributes < Types::BaseInputObject
  description "Attributes for creating or updating a Bank Account Check"

  argument :id,              String,  required: true
  argument :number,          String,  required: false
end
