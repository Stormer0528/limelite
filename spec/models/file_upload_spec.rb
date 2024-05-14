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

require "rails_helper"

RSpec.describe FileUpload, type: :model do
  it "has a valid factory" do
    expect(build_stubbed(:file_upload)).to be_valid
  end

  it { should belong_to(:uploadable) }
end
