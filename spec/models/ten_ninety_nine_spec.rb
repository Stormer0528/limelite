# == Schema Information
#
# Table name: ten_ninety_nines
#
#  id         :bigint(8)        not null, primary key
#  address_id :bigint(8)
#  year       :integer
#  ein        :string
#  ein_type   :string
#  file_url   :string
#  required   :boolean          default(FALSE)
#  vendor_id  :bigint(8)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_ten_ninety_nines_on_address_id  (address_id)
#  index_ten_ninety_nines_on_vendor_id   (vendor_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (vendor_id => vendors.id)
#

require "rails_helper"

RSpec.describe TenNinetyNine, type: :model do
  it "has a valid factory" do
    expect(build(:ten_ninety_nine)).to be_valid
  end

  context "Relationships:" do
    it { should belong_to(:vendor) }
    it { should belong_to(:address).optional }
  end

  context "Validations:" do
    it { should validate_numericality_of(:year).only_integer.is_greater_than(2000) }
    it { should validate_presence_of(:year) }
  end
end
