# == Schema Information
#
# Table name: file_uploads
#
#  id              :bigint(8)        not null, primary key
#  uploadable_type :string
#  uploadable_id   :bigint(8)
#  url             :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  organization_id :bigint(8)
#  creator_id      :bigint(8)
#  description     :string
#  file_type       :string
#
# Indexes
#
#  index_file_uploads_on_creator_id                         (creator_id)
#  index_file_uploads_on_organization_id                    (organization_id)
#  index_file_uploads_on_uploadable_type_and_uploadable_id  (uploadable_type,uploadable_id)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

class FileUpload < ApplicationRecord
  # Relationships
  belongs_to :organization
  belongs_to :creator, class_name: "User", optional: true
  belongs_to :uploadable, polymorphic: true, optional: true

  has_many :ap_file_download_logs, dependent: :destroy

  # Scopes
  scope :by_partial_description, ->(description) { where("description ILIKE CONCAT('%',?,'%')", description) }
  scope :by_partial_file_type, ->(file_type) { where("file_type ILIKE CONCAT('%',?,'%')", file_type) }
  scope :unarchived, -> { where("updated_at >= current_date - interval '1 week'") }
end
