# == Schema Information
#
# Table name: customers
#
#  id              :bigint(8)        not null, primary key
#  title           :string
#  first_name      :string
#  last_name       :string
#  middle_name     :string
#  suffix          :string
#  company         :string
#  email           :string
#  website         :string
#  notes           :text
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  slug            :string
#  logo_url        :string
#  aasm_state      :string
#  number          :string
#  creator_id      :bigint(8)
#
# Indexes
#
#  index_customers_on_aasm_state                (aasm_state)
#  index_customers_on_creator_id                (creator_id)
#  index_customers_on_organization_id           (organization_id)
#  index_customers_on_slug                      (slug)
#  index_customers_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :customer do
    association :organization, factory: :organization

    company { Faker::Company.name }
    email { Faker::Internet.email }
    # title "MyString"
    # first_name "MyString"
    # last_name "MyString"
    # middle_name "MyString"
    # suffix "MyString"
    # company "MyString"
    # email "MyString"
    # website "MyString"
    # notes "MyText"
  end
end
