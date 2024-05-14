# == Schema Information
#
# Table name: report_profit_and_loss_statements
#
#  id              :bigint(8)        not null, primary key
#  start_date      :date
#  end_date        :date
#  data            :jsonb
#  organization_id :bigint(8)
#  account_fund_id :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_report_profit_and_loss_statements_on_account_fund_id  (account_fund_id)
#  index_report_profit_and_loss_statements_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_fund_id => account_funds.id)
#  fk_rails_...  (organization_id => organizations.id)
#

require "rails_helper"
require "models/concerns/report_base_spec"
require "models/concerns/report_accountable_spec"

RSpec.describe Report::ProfitAndLossStatement, type: :model do
  it "should have a valid factory" do
    expect(build_stubbed(:profit_and_loss_statement)).to be_valid
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

  context "Creates tables" do
    # We need an organization and account funds to test inclusion
    let(:org) { FactoryBot.create :organization }
    before do
      FactoryBot.create :account_fund, organization: org, code: "2043"
      FactoryBot.create :account_fund, organization: org, code: "1234"
      FactoryBot.create :account_fund, organization: org, code: "1752"
      FactoryBot.create :account_fund, organization: org, code: "1930"
    end
    let(:report) { FactoryBot.build(:profit_and_loss_statement, organization: org) }

    it "creates material table views for report" do
      expect do
        report.drop_views
        report.run_report(true)
      end.not_to raise_error
    end

    it "creates a unique table name per report"
    it "removes tables after run"
  end

  pending "does not carry over extraeneous test data"
  pending "can access all keys by symbol or string"
end
