# == Schema Information
#
# Table name: credit_card_items
#
#  id              :bigint(8)        not null, primary key
#  date            :date
#  memo            :string
#  file_url        :string
#  type            :string
#  entry_id        :bigint(8)
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  credit_card_id  :bigint(8)
#  aasm_state      :string           default("draft")
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  creator_id      :bigint(8)
#  number          :string
#
# Indexes
#
#  index_credit_card_items_on_aasm_state      (aasm_state)
#  index_credit_card_items_on_creator_id      (creator_id)
#  index_credit_card_items_on_credit_card_id  (credit_card_id)
#  index_credit_card_items_on_date            (date)
#  index_credit_card_items_on_entry_id        (entry_id)
#  index_credit_card_items_on_type            (type)
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (credit_card_id => credit_cards.id)
#  fk_rails_...  (entry_id => entries.id)
#

require "rails_helper"

RSpec.describe CreditCard::Payment, type: :model do
  it "has a valid factory" do
    expect(build_stubbed(:credit_card_payment)).to be_valid
  end

  context "relationships" do
    it { should belong_to(:credit_card) }
    it { should belong_to(:creator).class_name("User") }
    it { should belong_to(:entry).dependent(:destroy).optional }
    it { should accept_nested_attributes_for(:entry) }

    it { should have_one(:reconciliation).dependent(:destroy) }
    it { should have_one(:reconciliation).dependent(:destroy) }
  end

  context "delegations" do
    it { should delegate_method(:balance).to(:entry).with_prefix(true) }
    it { should delegate_method(:entry_items).to(:entry) }
    it { should delegate_method(:entry_type).to(:entry) }
  end

  context "instance methods" do
    it "should convert type to titleized name" do
      subject.type = "CreditCard::Payment"
      expect(subject.name).to eq("payment")

      subject.type = "CreditCard::Charge"
      expect(subject.name).to eq("charge")
    end

    xit "#amount"
    xit "#amount_cents"
    xit "#amount_in_cents"
    xit "#date"
    xit "#reconcile(statement_id: nil)"
    xit "#reconciled?"

    xcontext "#payee" do
      it "should be nil if vendor is nil" do
        subject.vendors = nil
        expect(subject.payee).to be_nil
      end

      it "should eql vendor name if vendor is set" do
        vendor_name = "Test Vendor"
        subject.vendor = FactoryBot.build(:vendor, name: vendor_name)
        expect(subject.payee).to eql(vendor_name)
      end
    end
  end
end
