# == Schema Information
#
# Table name: report_vendor1099_reports
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb
#  organization_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_vendor1099_reports_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

require "rails_helper"
require "models/concerns/report_base_spec"

RSpec.describe Report::Vendor1099Report, type: :model do
  include_examples "report_base"

  context "run report with organizanization" do
    before do
      # Organization
      @org = create(:organization)
      subject.organization = @org

      # Vendors
      @vendor_regular = create(:vendor, organization: @org)
      @vendor_1099 = create(:vendor, organization: @org)
      build_list(:ten_ninety_nine_required, 3).each do |tnn|
        @vendor_1099.ten_ninety_nines << tnn
      end
      @vendor_1099.save

      @vendor_1099_not_required = create(:vendor, organization: @org)
      build_list(:ten_ninety_nine, 3).each do |tnn|
        @vendor_1099_not_required.ten_ninety_nines << tnn
      end
      @vendor_1099_not_required.save
    end

    it "does not include 1099 vendors where 1099 not required in the report" do
      vendor_array = subject.available_vendors.to_a
      expect(@org.vendors.to_a).to include(@vendor_1099_not_required)
      expect(vendor_array).not_to include(@vendor_1099_not_required)
    end

    it "includes only 1099 vendors where 1099 is required in the report" do
      vendor_array = subject.available_vendors.to_a

      expect(@org.vendors.to_a).to include(@vendor_1099)
      expect(@org.vendors.to_a).to include(@vendor_regular)
      expect(vendor_array).to include(@vendor_1099)
      expect(vendor_array).not_to include(@vendor_regular)
    end

    it "groups vendors with the same ein" do
      duplicate_ein_vendor = create(:vendor, organization: @org)
      duplicate_ein_vendor.ten_ninety_nines << create(:ten_ninety_nine_required, vendor: duplicate_ein_vendor,
                                                                                 ein: @vendor_1099.current_ten_ninety_nine.ein)
      normalized_ein = duplicate_ein_vendor.current_ten_ninety_nine.ein.gsub(/[^0-9]/, "")

      expect(subject.grouped_vendors[normalized_ein]).to be_a(Array)
      expect(subject.grouped_vendors[normalized_ein].count).to eql(2)
    end

    it "totals all entry items for date range" do
      # SETUP
      # -- In range entries
      create_list(
        :entry_with_items, 3,
        organization: @org,
        date: "2020-03-05",
        amount_in_cents: 5000,
        payable: @vendor_1099
      )

      # -- Out of range entries
      create_list(:entry_with_items, 2,
                  organization: @org,
                  date: "2020-08-05",
                  amount_in_cents: 5000,
                  payable: @vendor_1099)

      # -- For other vendor
      create_list(:entry_with_items, 2,
                  organization: @org,
                  date: "2020-03-05",
                  amount_in_cents: 5000,
                  payable: @vendor_regular)
      # EXECUTE
      subject.start_date = Date.parse "2020-03-01"
      subject.end_date = Date.parse "2020-03-06"
      subject.run_report

      # ASSERT
    end
    xit "adds starting balance to entry items"
    xit "does not include items with code 4000"

    xit "maintains a correct total when an entry has been reclassified" do
      # SETUP

      # CREATE Vendors

      expect(@vendor_1099.ten_ninety_nines.count).to eql(3)

      # CREATE a payment
      #   -- Payment date must be in date range
      #   -- Payment must be in

      # RUN report

      # ASSERT
      # -- vendor_1099 is in report
      # -- vendor_1099 total matches total payments
      # -- vendor_regular is not in report
    end
  end
end
