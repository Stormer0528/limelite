# == Schema Information
#
# Table name: bank_account_items
#
#  id              :bigint(8)        not null, primary key
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  date            :date
#  memo            :string
#  number          :string
#  type            :string
#  bank_account_id :bigint(8)
#  creator_id      :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  paper_check     :boolean          default(FALSE)
#  file_url        :string
#  aasm_state      :string
#  address_id      :bigint(8)
#  entry_id        :bigint(8)
#  check_type      :string
#
# Indexes
#
#  index_bank_account_items_on_aasm_state                  (aasm_state)
#  index_bank_account_items_on_address_id                  (address_id)
#  index_bank_account_items_on_bank_account_id             (bank_account_id)
#  index_bank_account_items_on_creator_id                  (creator_id)
#  index_bank_account_items_on_date                        (date)
#  index_bank_account_items_on_entry_id                    (entry_id)
#  index_bank_account_items_on_number_and_bank_account_id  (number,bank_account_id) UNIQUE WHERE ((number)::text <> ''::text)
#  index_bank_account_items_on_type                        (type)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (bank_account_id => bank_accounts.id)
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (entry_id => entries.id)
#

require "rails_helper"
require "models/concerns/authable"

RSpec.describe BankAccount::Item, type: :model do
  context "Relationships:" do
    it { should belong_to(:bank_account) }
    it { should belong_to(:creator).class_name("User") }
    it { should belong_to(:entry).dependent(:destroy).optional }
    it { should accept_nested_attributes_for(:entry) }

    it { should have_many(:customers).through(:entry) }
    it { should have_many(:vendors).through(:entry) }

    it { should belong_to(:address).optional }

    it { should have_one(:reconciliation) }

    it { should have_many(:entry_items) }
    it { should have_many(:payments) }
    it { should have_many(:invoices).through(:payments) }
  end

  it { should delegate_method(:name).to(:bank_account).with_prefix(true) }

  it_behaves_like "Authable"
end
