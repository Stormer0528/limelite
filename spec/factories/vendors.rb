# == Schema Information
#
# Table name: vendors
#
#  id                        :integer          not null, primary key
#  company                   :string
#  notes                     :text
#  email                     :string
#  other                     :string
#  website                   :string
#  account_number            :string
#  active                    :boolean
#  payment_terms             :text
#  global                    :boolean
#  rating                    :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  title                     :string
#  first_name                :string
#  middle_name               :string
#  last_name                 :string
#  suffix                    :string
#  organization_id           :integer
#  slug                      :string
#  logo_url                  :string
#  aasm_state                :string
#  file_url                  :string
#  start_date                :date
#  end_date                  :date
#  starting_balance_in_cents :integer          default(0), not null
#  starting_balance_currency :string           default("USD"), not null
#  creator_id                :bigint(8)
#
# Indexes
#
#  index_vendors_on_aasm_state                (aasm_state)
#  index_vendors_on_creator_id                (creator_id)
#  index_vendors_on_name                      (company,title,first_name,last_name,suffix)
#  index_vendors_on_organization_id           (organization_id)
#  index_vendors_on_slug                      (slug)
#  index_vendors_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :vendor do
    association :organization, factory: :organization

    company { Faker::Company.name }
    email { Faker::Internet.email }
    website { Faker::Internet.url }
    account_number { Faker::Company.swedish_organisation_number }
    active { true }
    payment_terms { Faker::Hipster.paragraph }
    global { false }
    rating { [1..5].sample }
  end
end
