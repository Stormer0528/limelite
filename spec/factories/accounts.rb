# == Schema Information
#
# Table name: accounts
#
#  id                  :integer          not null, primary key
#  organization_id     :integer
#  restriced           :boolean
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  account_function_id :integer
#  account_fund_id     :integer
#  account_goal_id     :integer
#  account_location_id :integer
#  account_object_id   :integer
#  account_resource_id :integer
#  account_year_id     :integer
#  slug                :string
#  budget_in_cents     :integer          default(0), not null
#  budget_currency     :string           default("USD"), not null
#
# Indexes
#
#  index_accounts_on_account_function_id       (account_function_id)
#  index_accounts_on_account_fund_id           (account_fund_id)
#  index_accounts_on_account_goal_id           (account_goal_id)
#  index_accounts_on_account_location_id       (account_location_id)
#  index_accounts_on_account_object_id         (account_object_id)
#  index_accounts_on_account_resource_id       (account_resource_id)
#  index_accounts_on_account_year_id           (account_year_id)
#  index_accounts_on_multiple_references       (organization_id,account_function_id,account_fund_id,account_goal_id,account_location_id,account_object_id,account_resource_id,account_year_id) UNIQUE
#  index_accounts_on_organization_id           (organization_id)
#  index_accounts_on_slug                      (slug)
#  index_accounts_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (account_function_id => account_functions.id)
#  fk_rails_...  (account_fund_id => account_funds.id)
#  fk_rails_...  (account_goal_id => account_goals.id)
#  fk_rails_...  (account_location_id => account_locations.id)
#  fk_rails_...  (account_object_id => account_objects.id)
#  fk_rails_...  (account_resource_id => account_resources.id)
#  fk_rails_...  (account_year_id => account_years.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :account do
    association :organization, factory: :organization

    # Leaving as block so org is shared across account elements
    account_function do
      association :account_function, organization: organization
    end

    account_fund do
      association :account_fund, organization: organization
    end

    account_goal do
      association :account_goal, organization: organization
    end

    account_location do
      association :account_location, organization: organization
    end

    account_object do
      association :account_object, organization: organization
    end

    account_resource do
      association :account_resource, organization: organization
    end

    account_year do
      association :account_year, organization: organization
    end

    after(:create) do |account|
      account.account_fund.save!
      account.account_function.save!
      account.account_goal.save!
      account.account_location.save!
      account.account_object.save!
      account.account_resource.save!
      account.account_year.save!
    end

    # Other Attributes
    restriced { false }
    budget_in_cents { 75_000 }
  end
end
