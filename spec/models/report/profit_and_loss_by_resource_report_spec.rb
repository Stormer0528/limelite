# == Schema Information
#
# Table name: profit_and_loss_by_resource
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
#  index_profit_and_loss_by_resource_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

require "rails_helper"
require "models/concerns/report_base_spec"
require "models/concerns/report_accountable_spec"

RSpec.describe Report::ProfitAndLossByResourceReport, type: :model do
  it "should have a valid factory" do
    expect(build_stubbed(:report_profit_and_loss_by_resource_report)).to be_valid
  end

  include_examples "report_base"
  include_examples "Report Accountable"

  context "When creating a new record" do
    let(:report) { FactoryBot.create(:profit_and_loss_statement) }

    it "should be valid when run with start_date, end_date and organization" do
      expect(report).to be_valid
    end

    it "should set fiscal year to correct year" do
      expect(report.data["fiscal_year"]).to eq(FiscalYear.get_year(report.end_date).year)
    end

    it "should set report_date to current date" do
      expect(report.data["report_date"]).to eq(Date.today.to_formatted_s(:std))
    end

    it "should contain all of the profit and loss keys" do
      Report::ProfitAndLossStatement::Categories.each do |category, ranges|
        expect(report.data).to have_key(category.to_s)

        ranges.each do |range, title|
          expect(report.data[category.to_s]).to have_key(range.to_s)
          expect(report.data[category.to_s][range.to_s]).to include({"title" => title})
        end
      end
    end

    it "should have totals objects" do
      Report::ProfitAndLossStatement::Categories.each do |category, _ranges|
        expect(report.data).to have_key "#{category}_range_totals"
        expect(report.data["#{category}_range_totals"]).to be_an_instance_of Hash

        expect(report.data).to have_key "#{category}_total"
        expect(report.data["#{category}_total"]).to be_an_instance_of String
      end

      expect(report.data).to have_key "excess_revenues"
      expect(report.data).to have_key "excess_revenues_totals"
    end
  end

  context "It creates a report for each fund" do
    let(:report) { FactoryBot.create(:profit_and_loss_statement) }
    it "Creates a report for all funds" do
      report.run_report(true)

      expect(report.data).to have_key(:reports)
      expect(report.data[:reports]).to have_key(:all)
    end
  end

  pending "does not carry over extraeneous test data"
  pending "can access all keys by symbol or string"
end
