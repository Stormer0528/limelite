class InputObjects::ModulePermissionsAttributes < Types::BaseInputObject
  description "Permissions for accessing site modules"

  argument :Report, String, required: false
  argument :Vendor, String, required: false
  argument :Account, String, required: false
  argument :Customer, String, required: false
  argument :CreditCard, String, required: false
  argument :BankAccount, String, required: false
  argument :BatchUpload, String, required: false
  argument :approval_amount, Integer, required: false
end
