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
#
# Indexes
#
#  index_credit_cards_on_organization_id           (organization_id)
#  index_credit_cards_on_slug                      (slug)
#  index_credit_cards_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#

require "rails_helper"
require "models/concerns/authable"

RSpec.describe CreditCard, type: :model do
  it "has a valid factory" do
    expect(build_stubbed(:credit_card)).to be_valid
  end

  it { should have_many(:charges).class_name("CreditCard::Charge").dependent("destroy") }
  it { should have_many(:payments).class_name("CreditCard::Payment").dependent("destroy") }
  it { should belong_to(:organization) }
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:number) }

  context " Evaluates Amounts of included account elements " do
    before(:example) do
      @account = build(:credit_card, starting_balance_in_cents: 0)
    end

    xit "sorts items with newest date first" do
      @account.charges.new amount: 3.01, date: 2.days.ago, memo: "Second Item"
      @account.payments.new amount: 14, date: DateTime.now, memo: "First Item"

      expect(@account.items[0][:memo]).to eq("First Item")
      expect(@account.items[1][:memo]).to eq("Second Item")
      expect(@account.items[2][:memo]).to eq("Third Item")
    end

    xit "includes all account elements in items" do
      @account.payments.new amount: 3.01
      @account.payments.new amount: 14
      @account.charges.new amount: 231
      @account.charges.new amount: 231_221.14

      expect(@account.items.count).to eq(4)
    end
  end

  it_behaves_like "Authable"
end
