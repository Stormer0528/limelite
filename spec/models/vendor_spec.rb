# == Schema Information
#
# Table name: vendors
#
#  id                        :integer          not null, primary key
#  company                   :string
#  notes                     :text
#  email                     :string
#  other                     :string
#  website                   :string
#  account_number            :string
#  active                    :boolean
#  payment_terms             :text
#  global                    :boolean
#  rating                    :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  title                     :string
#  first_name                :string
#  middle_name               :string
#  last_name                 :string
#  suffix                    :string
#  organization_id           :integer
#  slug                      :string
#  logo_url                  :string
#  aasm_state                :string
#  file_url                  :string
#  start_date                :date
#  end_date                  :date
#  starting_balance_in_cents :integer          default(0), not null
#  starting_balance_currency :string           default("USD"), not null
#  creator_id                :bigint(8)
#
# Indexes
#
#  index_vendors_on_aasm_state                (aasm_state)
#  index_vendors_on_creator_id                (creator_id)
#  index_vendors_on_name                      (company,title,first_name,last_name,suffix)
#  index_vendors_on_organization_id           (organization_id)
#  index_vendors_on_slug                      (slug)
#  index_vendors_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#  fk_rails_...  (ten_ninety_nine_address_id => addresses.id)
#

require "rails_helper"
require "money-rails/test_helpers"
require "models/concerns/authable"
require "models/concerns/payable"

RSpec.describe Vendor, type: :model do
  context "Relationships" do
    it { should belong_to(:organization) }

    it { should have_many(:addresses) }
    it { should have_many(:ten_ninety_nines).order(year: :desc).dependent(:destroy) }
    it { should have_many(:purchase_orders) }

    it { should have_many(:entry_items) }
    it { should have_many(:file_uploads).class_name("FileUpload") }

    it { should have_many(:entry_items) }
    it { should have_many(:file_uploads).class_name("FileUpload") }
    it { should have_many(:purchase_orders) }
    it { should have_many(:ten_ninety_nines) }

    context "Phones:" do
      it { should have_one(:fax_phone).class_name("Phone::Fax") }
      it { should have_one(:home_phone).class_name("Phone::Home") }
      it { should have_one(:mobile_phone).class_name("Phone::Mobile") }
      it { should have_one(:work_phone).class_name("Phone::Work") }
    end
  end

  context "Monetize:" do
    it { should monetize(:starting_balance) }
  end

  context "Factories:" do
    it "has a valid factory" do
      expect(build_stubbed(:vendor)).to be_valid
    end

    xit "can build a valid 1099 vendor" do
      vendor = build(:vendor_1099)
      expect(vendor).to be_valid
      # expect some 1099 things
    end
  end

  context "Scopes:" do
    xit "#by_partial_name" do
    end

    xit "#by_partial_number" do
    end

    xit "#order_by_name" do
    end
  end

  it_behaves_like "Payable"

  context do
    let(:record) { build(:vendor) }
    it_behaves_like "Authable"
  end
end
