# == Schema Information
#
# Table name: entry_items
#
#  id              :bigint(8)        not null, primary key
#  entry_id        :bigint(8)
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  type            :string
#  account_id      :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  memo            :string
#  payable_type    :string
#  payable_id      :bigint(8)
#
# Indexes
#
#  index_entry_items_on_account_id                   (account_id)
#  index_entry_items_on_entry_id                     (entry_id)
#  index_entry_items_on_payable_type_and_payable_id  (payable_type,payable_id)
#  index_entry_items_on_type                         (type)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (entry_id => entries.id)
#

require "rails_helper"
require "money-rails/test_helpers"

RSpec.describe EntryItem, type: :model do
  context "Relationships:" do
    it "has a valid factory" do
      expect(build_stubbed(:entry_item)).to be_valid
    end

    it "has a valid credit factory" do
      expect(build_stubbed(:credit)).to be_valid
    end

    it "has a valid debit factory" do
      expect(build_stubbed(:debit)).to be_valid
    end
  end

  it { is_expected.to monetize(:amount) }

  context "Relationships:" do
    it { should belong_to(:entry) }
    it { should belong_to(:account) }
  end

  context "Delegations:" do
    it { should delegate_method(:account_function_code).to(:account) }
    it { should delegate_method(:account_fund_code).to(:account) }
    it { should delegate_method(:account_goal_code).to(:account) }
    it { should delegate_method(:account_location_code).to(:account) }
    it { should delegate_method(:account_object_code).to(:account) }
    it { should delegate_method(:account_resource_code).to(:account) }
    it { should delegate_method(:account_year_code).to(:account) }
    it { should delegate_method(:number).to(:account).with_prefix }
  end
end
