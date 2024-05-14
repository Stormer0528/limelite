# == Schema Information
#
# Table name: addresses
#
#  id               :integer          not null, primary key
#  line1            :string
#  line2            :string
#  city             :string
#  state            :string
#  zip              :string
#  addressable_type :string
#  addressable_id   :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  name             :string
#  attention        :string
#  department       :string
#
# Indexes
#
#  index_addresses_on_addressable_id_and_addressable_type  (addressable_id,addressable_type)
#

require "rails_helper"

RSpec.describe Address, type: :model do
  it "should have a valid factory" do
    expect(build(:address)).to be_valid
  end

  it { should belong_to(:addressable) }

  it "should be empty when no fields are specified" do
    expect(described_class.new.empty?).to be(true)
  end

  it "should respond true to empty? when some fields are specified" do
    expect(described_class.new(line1: "123 some address").empty?).to be(false)
    expect(described_class.new(line2: "123 some address").empty?).to be(false)
    expect(described_class.new(city: "Some City").empty?).to be(false)
    expect(described_class.new(state: "CA").empty?).to be(false)
    expect(described_class.new(zip: "92532").empty?).to be(false)
  end
end
