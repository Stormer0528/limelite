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

FactoryBot.define do
  factory :file_upload do
    association :uploadable, factory: :vendor
    association :creator,    factory: :user

    uploadable_type { "Vendor" }
    url { Faker::Internet.url(scheme: "https", host: "cdn.filestack.com") }
    description { Faker::Company.industry }
    file_type { Faker::File.mime_type }
  end
end
