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

FactoryBot.define do
  factory :ten_ninety_nine do
    association :vendor, factory: :vendor
    association :address, factory: :address

    year { Faker::Vehicle.year }
    ein { Faker::Company.ein }
    ein_type { Vendor::TYPES.sample }

    factory :ten_ninety_nine_required do
      required { true }
    end
  end
end
