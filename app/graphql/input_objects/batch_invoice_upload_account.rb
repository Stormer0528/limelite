class InputObjects::BatchInvoiceUploadAccount < Types::BaseInputObject
  argument :accountId, ID, required: false
  argument :accountNumber, String, required: false
  argument :amount, Float, required: false
end
