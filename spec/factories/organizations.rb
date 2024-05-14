# == Schema Information
#
# Table name: organizations
#
#  id          :integer          not null, primary key
#  name        :string
#  description :string
#  email       :string
#  phone       :string
#  subdomain   :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  slug        :string
#  alias       :string
#
# Indexes
#
#  index_organizations_on_alias      (alias)
#  index_organizations_on_name       (name) UNIQUE
#  index_organizations_on_slug       (slug)
#  index_organizations_on_subdomain  (subdomain) UNIQUE
#

FactoryBot.define do
  factory :organization, aliases: [:org, :current_org] do
    name { Faker::University.name }
    description { Faker::Marketing.buzzwords }
    email { Faker::Internet.email }
    phone { Faker::PhoneNumber.phone_number }
    subdomain { Faker::University.prefix.downcase }
  end
end
