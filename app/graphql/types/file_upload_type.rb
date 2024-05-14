module Types
  class FileUploadType < Types::BaseObject
    field :id, ID, null: true

    field :uploadable_type, String, null: false
    field :uploadable_id, ID, null: false

    field :url, String, null: true
    field :description, String, null: true
    field :file_type, String, null: true

    field :creator_id, ID, null: false
    field :creator, Types::UserType, null: true

    field :created_at, String, null: true
    field :updated_at, String, null: true
    field :organization, Types::OrganizationType, null: false

    field :ap_downloaded,    Boolean, null: false

    def ap_downloaded
      if object.ap_file_download_logs.length() > 0
        true
      else
        false
      end
    end
  end
end
