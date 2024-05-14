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

require "rails_helper"

RSpec.describe Organization, type: :model do
  context "Factories:" do
    it "has a valid factory" do
      expect(build_stubbed(:organization)).to be_valid
    end
  end

  it { should validate_presence_of(:name) }
  it { should validate_uniqueness_of(:name) }
  it { should validate_presence_of(:subdomain) }
  it { should validate_uniqueness_of(:subdomain) }

  # Vendors
  it { should have_many(:vendors).dependent(:destroy) }
  it { should have_many(:invoices) }
  it { should have_many(:payments).through(:invoices) }
  it { should have_many(:purchase_orders) }

  # Cusotmers
  it { should have_many(:customers).dependent(:destroy) }

  # Users
  it { should have_many(:organization_assignments).dependent(:destroy) }
  it { should have_many(:viewer_assignments).dependent(:destroy) }
  it { should have_many(:viewers).through(:viewer_assignments).source(:user) }
  it { should have_many(:editor_assignments).dependent(:destroy) }
  it { should have_many(:editors).through(:editor_assignments).source(:user) }
  it { should have_many(:owner_assignments).dependent(:destroy) }
  it { should have_many(:owners).through(:owner_assignments).source(:user) }

  # Address
  it { should have_many(:addresses).dependent(:destroy) }
  it { should accept_nested_attributes_for(:addresses).allow_destroy(true) }

  # Accounts
  it { should have_many(:accounts).dependent(:destroy) }
  it { should have_many(:entries) }
  it { should have_many(:account_functions).class_name("AccountFunction").dependent(:destroy) }
  it { should have_many(:account_funds).class_name("AccountFund").dependent(:destroy) }
  it { should have_many(:account_goals).class_name("AccountGoal").dependent(:destroy) }
  it { should have_many(:account_locations).class_name("AccountLocation").dependent(:destroy) }
  it { should have_many(:account_objects).class_name("AccountObject").dependent(:destroy) }
  it { should have_many(:account_resources).class_name("AccountResource").dependent(:destroy) }
  it { should have_many(:account_years).class_name("AccountYear").dependent(:destroy) }

  # Bank Accounts
  it { should have_many(:bank_accounts).dependent(:destroy) }
  it { should have_many(:checks).through(:bank_accounts) }
  it { should have_many(:deposits).through(:bank_accounts) }
  it { should have_many(:account_transfers).through(:bank_accounts) }
  it { should have_many(:printer_settings) }

  # Credit Cards
  it { should have_many(:credit_cards).dependent(:destroy) }
  # it { should have_many(:credit_card_charges).through(:credit_cards).source("charges") }
end
