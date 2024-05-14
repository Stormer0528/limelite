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

require "rails_helper"
require "models/concerns/authable"

RSpec.describe Account, type: :model do
  it_behaves_like "Authable"

  context "Factories:" do
    it "has a valid factory" do
      expect(build_stubbed(:account)).to be_valid
    end
  end

  context "Relationships" do
    it { should have_one(:bank_account) }
    it { should have_many(:entry_items) }
    it { should have_many(:entries).through(:entry_items) }

    it { should belong_to(:account_function) }
    it { should belong_to(:account_fund) }
    it { should belong_to(:account_goal) }
    it { should belong_to(:account_location) }
    it { should belong_to(:account_object) }
    it { should belong_to(:account_resource) }
    it { should belong_to(:account_year) }
  end

  context "Validations:" do
    skip "Need to re-examine scoping" do
      it {
        should validate_uniqueness_of(:organization_id).case_insensitive.scoped_to(%i[account_function_id account_fund_id account_goal_id
                                                                                      account_location_id account_object_id account_resource_id
                                                                                      account_year_id])
      }
    end
  end

  context "Delegations:" do
    it { should delegate_method(:code).to(:account_function).with_prefix }
    it { should delegate_method(:code).to(:account_fund).with_prefix }
    it { should delegate_method(:code).to(:account_goal).with_prefix }
    it { should delegate_method(:code).to(:account_location).with_prefix }
    it { should delegate_method(:code).to(:account_object).with_prefix }
    it { should delegate_method(:code).to(:account_resource).with_prefix }
    it { should delegate_method(:code).to(:account_year).with_prefix }
  end

  context "Scopes:" do
    it "should have a scope called cash accounts including accounts that have bank accounts" do
      skip "TODO: figure out why org subdomain is taken"
      org = Organization.create name: "test Org", subdomain: "aabbcc"

      3.times do |i|
        acc = build_stubbed(:account, name: "account-#{i}")
        acc.organization = org
      end

      bank_account1 = create(:bank_account)
      bank_account2 = create(:bank_account, name: "acc2", subdomain: "acc2")

      bank_account1.update account: Account.first
      bank_account2.update account: Account.last

      expect(Account.all.count).to_be 3
      expect(Account.cash_accounts.count).to_be 2
    end
  end
end
