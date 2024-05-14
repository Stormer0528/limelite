class InputObjects::BatchInvoiceUploadFile < Types::BaseInputObject
  argument :handle, String, required: false
  argument :url, String, required: false
  argument :uploadId, String, required: false
  argument :accounts, [InputObjects::BatchInvoiceUploadAccount], required: false
  argument :amount, Float, required: false
  argument :vendorName, String, required: false
  argument :vendorId, ID, required: false
  argument :notes, String, required: false
  argument :invoiceNumber, String, required: false
  argument :approved, Boolean, required: false
  argument :path, String, required: false
  argument :date, String, required: false
  argument :dueDate, String, required: false
  argument :invoiceNumber, String, required: false
end
