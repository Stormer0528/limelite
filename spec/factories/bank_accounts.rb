# == Schema Information
#
# Table name: bank_accounts
#
#  id                        :bigint(8)        not null, primary key
#  pseudo                    :string
#  number                    :string
#  name                      :string
#  description               :text
#  started_at                :date
#  ended_at                  :date
#  edp_number                :string
#  state_account_number      :string
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  organization_id           :bigint(8)
#  starting_balance_in_cents :integer          default(0), not null
#  starting_balance_currency :string           default("USD"), not null
#  account_object_id         :bigint(8)
#  slug                      :string
#  routing_number            :string
#  bank_name                 :string
#  fractional_number         :string
#  creator_id                :bigint(8)
#
# Indexes
#
#  index_bank_accounts_on_account_object_id         (account_object_id)
#  index_bank_accounts_on_creator_id                (creator_id)
#  index_bank_accounts_on_organization_id           (organization_id)
#  index_bank_accounts_on_slug                      (slug)
#  index_bank_accounts_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (account_object_id => account_objects.id)
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :bank_account do
    association :organization, factory: :organization

    account_object do
      association :account_object, organization: organization
    end

    number { Faker::Bank.account_number }
    name { Faker::Bank.name }
    description { Faker::Commerce.department }
    started_at { Faker::Date.between(from: 12.months.ago, to: 9.months.ago) }
    starting_balance { Faker::Number.decimal(l_digits: 2) }
    bank_name { Faker::Bank.name.titleize }
    routing_number { Faker::Bank.routing_number }

    # factory :bank_account_with_items do
    #   after(:create) {|_bank_account| do_something_to(user) }
    # end
  end
end
