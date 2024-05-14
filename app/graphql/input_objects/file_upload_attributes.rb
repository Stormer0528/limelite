class InputObjects::FileUploadAttributes < Types::BaseInputObject
  description "Attributes for creating file uploads"

  # argument :id, String, required: false
  # argument :creator_id,      ID, required: true

  argument :uploadable_id,   ID, required: true
  argument :uploadable_type, String, required: true

  argument :url,             String, required: false
  argument :description,     String, required: false
  argument :file_type,       String, required: false
end
