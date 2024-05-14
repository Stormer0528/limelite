# == Schema Information
#
# Table name: account_objects
#
#  id              :integer          not null, primary key
#  name            :string
#  code            :string
#  organization_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  normal_balance  :string
#  object_type     :string
#  slug            :string
#
# Indexes
#
#  index_account_objects_on_code                      (code)
#  index_account_objects_on_code_and_organization_id  (code,organization_id) UNIQUE
#  index_account_objects_on_normal_balance            (normal_balance)
#  index_account_objects_on_object_type               (object_type)
#  index_account_objects_on_organization_id           (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :account_object, class: "AccountObject" do
    association :organization, factory: :organization

    name { Faker::Company.buzzword }
    code { Faker::Number.number(digits: 4) }
  end
end
