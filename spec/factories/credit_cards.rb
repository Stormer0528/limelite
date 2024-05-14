# == Schema Information
#
# Table name: credit_cards
#
#  id                        :bigint(8)        not null, primary key
#  name                      :string
#  number                    :string(4)
#  description               :string
#  starting_balance_in_cents :integer          default(0), not null
#  starting_balance_currency :string           default("USD"), not null
#  started_at                :date
#  ended_at                  :date
#  organization_id           :bigint(8)
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  pseudo                    :string
#  slug                      :string
#  limit_in_cents            :integer          default(0), not null
#  limit_currency            :string           default("USD"), not null
#  creator_id                :bigint(8)
#
# Indexes
#
#  index_credit_cards_on_creator_id                (creator_id)
#  index_credit_cards_on_organization_id           (organization_id)
#  index_credit_cards_on_slug                      (slug)
#  index_credit_cards_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :credit_card do
    association :organization, factory: :organization

    name { Faker::Bank.name }
    number { "1234" }
    starting_balance { 10_000 }
    started_at { Faker::Date.backward(days: 90) }

    description { Faker::Educator.university }
    # ended_at nil
  end
end
