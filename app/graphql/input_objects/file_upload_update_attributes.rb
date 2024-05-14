class InputObjects::FileUploadUpdateAttributes < InputObjects::FileUploadAttributes
  description "Attributes for updating file uploads"

  argument :id, ID, required: true

  argument :uploadable_id,   ID, required: false
  argument :uploadable_type, String, required: false
end
