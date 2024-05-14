# == Schema Information
#
# Table name: entries
#
#  id               :integer          not null, primary key
#  organization_id  :integer
#  creator_id       :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  date             :date
#  entry_type       :string           default("Transaction")
#  journalable_type :string
#  journalable_id   :bigint(8)
#  aasm_state       :string
#  backup_file_url  :string
#  file_url         :string
#
# Indexes
#
#  index_entries_on_aasm_state                           (aasm_state)
#  index_entries_on_creator_id                           (creator_id)
#  index_entries_on_date                                 (date)
#  index_entries_on_entry_type                           (entry_type)
#  index_entries_on_journalable_type_and_journalable_id  (journalable_type,journalable_id)
#  index_entries_on_organization_id                      (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

require "rails_helper"
require "models/concerns/authable"

RSpec.describe Entry, type: :model do
  context "Factories:" do
    it "has a valid factory" do
      expect(build_stubbed(:entry)).to be_valid
    end

    context ":entry_with_items" do
      it "has a valid factory with entry items" do
        expect(build(:entry_with_items)).to be_valid
      end

      it "creates a factory with 2 balanced items by default" do
        expect(create(:entry_with_items).entry_items.count).to eql(2)
        expect(build(:entry_with_items)).to be_balanced
      end

      it "can set amount_in_cents on entries" do
        entry = build(:entry_with_items, amount_in_cents: 15_000)
        expect(entry.amount_in_cents).to eql(15_000)
        expect(entry.entry_items.first.amount_in_cents).to eql(15_000)
        expect(entry.entry_items.last.amount_in_cents).to eql(-15_000)
      end

      it "can set a vendor as payable on entry items" do
        vendor = create(:vendor) # must create so there's an id
        entry = build(:entry_with_items, payable: vendor)

        expect(entry.entry_items.first.payable_id).to eql(vendor.id)
        expect(entry.entry_items.last.payable_id).to eql(vendor.id)
        expect(entry.entry_items.first.payable_type).to eql("Vendor")
        expect(entry.entry_items.last.payable_type).to eql("Vendor")
      end

      it "can set a customer as payable on entry items" do
        customer = create(:customer) # must create so there's an id
        entry = build(:entry_with_items, payable: customer)

        expect(entry.entry_items.first.payable_id).to eql(customer.id)
        expect(entry.entry_items.last.payable_id).to eql(customer.id)
        expect(entry.entry_items.first.payable_type).to eql("Customer")
        expect(entry.entry_items.last.payable_type).to eql("Customer")
      end
    end
  end

  context "Relationships:" do
    it { should belong_to(:organization) }

    it { should have_many(:entry_items) }
    it { should have_many(:credits) }
    it { should have_many(:debits) }

    it { should have_many(:accounts).through(:entry_items) }
  end

  context "Validations:", skip: "Need to refactor for updated EntryItem#balanced?" do
    it "should be invalid when it is not balanced" do
      @je = build(:entry)
      @je.credits.new amount: 12.34
      @je.credits.new amount: 1500
      @je.credits.new amount: 2000.12

      expect(@je.valid?).to be(false)
      expect(@je.errors[:balance]).to include("must be balanced")
    end

    it "should be valid when it is balanced" do
      @je = build(:entry)
      @je.credits.new amount: 12.34
      @je.credits.new amount: 1500
      @je.credits.new amount: 2000.12
      @je.debits.new amount: 3512.46

      expect(@je.balanced?).to be(true)
      expect(@je.valid?).to be(true)
      expect(@je.errors[:balance]).to_not include("must be balanced")
    end
  end

  context "Instance Methods:", skip: "Need to refactor for updated EntryItem#balanced?" do
    context "Totals:" do
      before do
        @je = build(:entry)
      end

      it "should total attached credits positively" do
        @je.credits.new amount: 12.34
        @je.credits.new amount: 1500
        @je.credits.new amount: 2000.12

        expect(@je.total_credits.to_f).to eq(3512.46)
      end

      it "should total attached debits in the negative" do
        @je.debits.new amount: 12.34
        @je.debits.new amount: 1500
        @je.debits.new amount: 2000.12

        expect(@je.total_debits.to_f).to eq(-3512.46)
      end

      it "should return false if credits and debits are not balanced" do
        @je.credits.new amount: 12.34
        @je.credits.new amount: 1500
        @je.credits.new amount: 2000.12

        @je.debits.new amount: 3500
        @je.debits.new amount: 12

        expect(@je.balanced?).to be(false)
      end

      it "should return true if credits and debits are balanced" do
        @je.credits.new amount: 12.34
        @je.credits.new amount: 1500
        @je.credits.new amount: 2000.12

        @je.debits.new amount: 3512.46

        expect(@je.balanced?).to be(true)
      end

      it "give the difference between credits and debits" do
        @je.credits.new amount: 12.34
        @je.credits.new amount: 1500
        @je.credits.new amount: 2000.12

        @je.debits.new amount: 3500
        @je.debits.new amount: 12

        expect(@je.balance.to_f).to eq(0.34 + 0.12)
      end
    end
  end

  context "Entry#update" do
    let(:org) { FactoryBot.create :organization }
    let(:account_fund) { FactoryBot.create :account_fund, organization: org }
    let(:account_resource) { FactoryBot.create :account_resource, organization: org }
    let(:account) {
      FactoryBot.create :account, account_fund: account_fund, account_resource: account_resource, organization: org
    }
    let(:account2) {
      FactoryBot.create :account, account_fund: account_fund, account_resource: account_resource, organization: org
    }
    let(:account3) {
      FactoryBot.create :account, account_fund: account_fund, account_resource: account_resource, organization: org
    }

    it "should be invalid when it is not balanced" do
      entry = build_entry
      expect(entry).to be_valid

      entry.entry_items[1].amount_in_cents = 1000
      expect(entry).not_to be_valid
    end

    it "should balance credits and debits when type is changes through :entry_item_attributes" do
      entry = build_entry
      expect(entry).to be_valid
      entry.save
      entry.assign_attributes entry_update_attributes(entry.entry_items)

      # verify types have changed
      expect(entry.entry_items[0].type).to eq("Credit")
      expect(entry.entry_items[1].type).to eq("Debit")
      expect(entry.entry_items[2].type).to eq("Debit")

      # verify memos have changed
      expect(entry.entry_items[0].memo).to eq("0. Updated Memo")
      expect(entry.entry_items[1].memo).to eq("1. Updated Memo")
      expect(entry.entry_items[2].memo).to eq("2. Updated Memo")

      # verify amounts have changed
      expect(entry.entry_items[0].amount_in_cents).to eq(150_000)
      expect(entry.entry_items[1].amount_in_cents).to eq(100_000)
      expect(entry.entry_items[2].amount_in_cents).to eq(50_000)

      # Entry should still be balanced
      expect(entry).to be_balanced
    end

    def build_entry
      entry = build(:entry, organization: org)

      # Create Entry Items
      entry.entry_items.new attributes_for(:ei_credit, amount_in_cents: 500)
      entry.entry_items.new attributes_for(:ei_credit, amount_in_cents: 500)
      entry.entry_items.new attributes_for(:ei_debit,  amount_in_cents: 1000)

      # Sent Accounts for items
      entry.entry_items[0].account = account
      entry.entry_items[1].account = account2
      entry.entry_items[2].account = account3

      entry
    end

    def entry_update_attributes(entry_items)
      {
        "date" => "2020-02-09",
        "entry_type" => "Transaction",
        "entry_items_attributes" => {
          "0" => {
            "id" => entry_items[0].id.to_s,
            "type" => "Credit",
            "memo" => "0. Updated Memo",
            "amount" => "1500.00"
          },
          "1" => {
            "id" => entry_items[1].id.to_s,
            "type" => "Debit",
            "memo" => "1. Updated Memo",
            "amount" => "1000.00",
            "payable_type" => "",
            "payable_id" => ""
          },
          "2" => {
            "id" => entry_items[2].id.to_s,
            "type" => "Debit",
            "memo" => "2. Updated Memo",
            "amount" => "500.00"
          }
        }
      }
    end
  end

  context do
    let(:record) { build(:entry) }
    it_behaves_like "Authable"
  end
end
