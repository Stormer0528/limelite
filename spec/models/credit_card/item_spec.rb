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
require "models/concerns/authable"

RSpec.describe CreditCard::Item, type: :model do
  context "Relationships:" do
    it { should belong_to(:credit_card) }
    it { should belong_to(:creator).class_name("User") }
    it { should belong_to(:entry).dependent(:destroy).optional }
    it { should accept_nested_attributes_for(:entry) }

    it { should have_many(:customers).through(:entry) }
    it { should have_many(:vendors).through(:entry) }

    it { should have_one(:reconciliation) }
  end

  context "delegations" do
    it { should delegate_method(:balance).to(:entry).with_prefix(true) }
    it { should delegate_method(:entry_items).to(:entry) }
    it { should delegate_method(:entry_type).to(:entry) }
  end

  it_behaves_like "Authable"
end
