# == Schema Information
#
# Table name: phones
#
#  id             :integer          not null, primary key
#  number         :string
#  type           :string
#  phoneable_id   :integer
#  phoneable_type :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_phones_on_phoneable_type_and_phoneable_id  (phoneable_type,phoneable_id)
#

FactoryBot.define do
  factory :phone do
    # number "MyString"
    # type ""
    # phoneable_id 1
    # phoneable_type "MyString"
  end
end
