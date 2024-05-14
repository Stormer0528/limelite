module FileUploadable
  extend ActiveSupport::Concern

  included do
    # VALIDATIONS
    #-----------------------------------------------------------------------------
    # validates :file_url, exclusion: {in: ["undefined"], message: "Please re-upload file"}
  end
end
