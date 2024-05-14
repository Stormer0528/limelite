# == Schema Information
#
# Table name: account_locations
#
#  id              :integer          not null, primary key
#  name            :string
#  code            :string
#  organization_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  slug            :string
#
# Indexes
#
#  index_account_locations_on_code                      (code)
#  index_account_locations_on_code_and_organization_id  (code,organization_id) UNIQUE
#  index_account_locations_on_organization_id           (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

require "rails_helper"

RSpec.describe AccountLocation, type: :model do
  it "has a valid factory" do
    expect(build_stubbed(:account_location)).to be_valid
  end

  context "Relationships:" do
    it { should belong_to(:organization) }
    it { should have_many(:accounts) }
  end

  context "Validations:" do
    it { should validate_presence_of(:code) }
    it { should validate_uniqueness_of(:code).scoped_to(:organization_id).ignoring_case_sensitivity }
    it { should validate_presence_of(:name) }
  end
end
