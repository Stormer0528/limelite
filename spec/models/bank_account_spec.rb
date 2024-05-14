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

require "rails_helper"
require "models/concerns/authable"

RSpec.describe BankAccount, type: :model do
  context "Factories:" do
    it "has a valid factory", focus: true do
      expect(build_stubbed(:bank_account)).to be_valid
    end

    it "sets it has the same organizaiton id as the account_object" do
      account = create(:bank_account)
      expect(account.organization_id).to be_eql(account.account_object.organization_id)
    end
  end

  it_behaves_like "Authable"

  context "Relationships" do
    it { should have_many(:account_transfers) }
    it { should belong_to(:account) }
    it { should have_many(:deposits) }
    it { should have_many(:checks) }
    it { should have_many(:statements) }
    it { should have_many(:reconciliations) }
  end

  context "Validations" do
    it { should validate_presence_of(:started_at) }
    it { should validate_presence_of(:number) }
    it { should   validate_presence_of(:starting_balance_in_cents) }
    it { should   validate_numericality_of(:starting_balance_in_cents) }
  end

  # Totals
  context " Evaluates Amounts of included account elements " do
    before(:example) do
      @account = build(:bank_account, starting_balance_in_cents: 0)
    end

    it "correctly totals included checks using a negative value" do
      @account.checks.new amount: 1.14
      @account.checks.new amount: 15.00
      @account.checks.new amount: 3.01

      expect(@account.items.count).to eq(3)
      expect(@account.balance.to_f).to eq(-19.15)
    end

    it "correctly totals included deposits using a positive value" do
      @account.deposits.new amount: 21.14
      @account.deposits.new amount: 14
      @account.deposits.new amount: 1133.01
      @account.deposits.new amount: 0.45

      expect(@account.items.count).to eq(4)
      expect(@account.balance.to_f).to eq(1168.60)
    end

    it "correctly totals included transfers_to using a positive value" do
      @account.account_transfers.new amount: 1_231_221.14
      @account.account_transfers.new amount: 231
      @account.account_transfers.new amount: 1133.01
      @account.account_transfers.new amount: 0.97

      expect(@account.items.count).to eq(4)
      expect(@account.balance.to_f).to eq(1_232_586.12)
    end

    it "correctly totals included transfers_to using a positive value" do
      @account.from_account_transfers.new amount: 231_221.14
      @account.from_account_transfers.new amount: 987
      @account.from_account_transfers.new amount: 1433.01
      @account.from_account_transfers.new amount: 0.97

      expect(@account.items.count).to eq(4)
      expect(@account.balance.to_f).to eq(-233_642.12)
    end

    it "includes all account elements in items" do
      @account.checks.new amount: 3.01
      @account.deposits.new amount: 14
      @account.account_transfers.new amount: 231
      @account.from_account_transfers.new amount: 231_221.14

      expect(@account.items.count).to eq(4)
    end

    it "sorts items with newest date first" do
      @account.checks.new amount: 3.01, date: 2.days.ago, memo: "Second Item"
      @account.deposits.new amount: 14, date: DateTime.now, memo: "First Item"
      @account.account_transfers.new amount: 231, date: 4.days.ago, memo: "Third Item"

      expect(@account.items[0][:memo]).to eq("First Item")
      expect(@account.items[1][:memo]).to eq("Second Item")
      expect(@account.items[2][:memo]).to eq("Third Item")
    end
  end
end
