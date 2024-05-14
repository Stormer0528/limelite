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

class TenNinetyNine < ApplicationRecord
  belongs_to :vendor, optional: true
  belongs_to :address, optional: true

  validates :year, presence: true, numericality: {only_integer: true, greater_than: 2000}
end
