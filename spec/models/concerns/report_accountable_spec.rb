# Report Accountable
#--------------------------------------------
# tests for reports that can be filtered based on account elements
RSpec.shared_examples "Report Accountable" do
  context "successfully selects funds based on codes" do
    # We need an organization and account funds to test inclusion
    let(:org) { FactoryBot.create :organization }
    before do
      FactoryBot.create :account_fund, organization: org, code: "2043"
      FactoryBot.create :account_fund, organization: org, code: "1234"
      FactoryBot.create :account_fund, organization: org, code: "1752"
      FactoryBot.create :account_fund, organization: org, code: "1930"
    end
    let(:report) { FactoryBot.build(:profit_and_loss_statement, organization: org) }

    it "only includes a single report when a single number is given" do
      report.account_search_params = {fund_code: "1234"}
      report.run_report(true)

      fund_codes = report.data.with_indifferent_access[:account_funds].map {|fund| fund.dig("code") }
      expect(fund_codes).to include("1234")

      expect(fund_codes).not_to include("2043")
      expect(fund_codes).not_to include("1752")
      expect(fund_codes).not_to include("1930")
    end

    context "includes all elements when no account is given" do
      it "when nil" do
        report.account_search_params = nil
        report.run_report

        expect(report.data["account_funds"]).to be_a(Array)
        expect(report.data["account_funds"].count).to be(4)
      end

      it "when empty object" do
        report.account_search_params = {}
        report.run_report

        expect(report.data["account_funds"]).to be_a(Array)
        expect(report.data["account_funds"].count).to be(4)
      end

      it "when fund_code is an empty array" do
        report.account_search_params = {fund_code: []}
        report.run_report

        expect(report.data["account_funds"]).to be_a(Array)
        expect(report.data["account_funds"].count).to be(4)
      end

      it "when fund_code is an array of empty strings" do
        report.account_search_params = {fund_code: ["", ""]}
        report.run_report

        expect(report.data["account_funds"]).to be_a(Array)
        expect(report.data["account_funds"].count).to be(4)
      end
    end

    it "includes only elements in a list" do
      report.account_search_params = {fund_code: "1234,2043"}
      report.run_report(true)

      fund_codes = report.data.with_indifferent_access[:account_funds].map {|fund| fund.dig("code") }
      expect(fund_codes).to include("1234")
      expect(fund_codes).to include("2043")

      expect(fund_codes).not_to include("1752")
      expect(fund_codes).not_to include("1930")
    end

    it "includes all elements in a range separated by -" do
      report.account_search_params = {fund_code: "1200-1950"}
      report.run_report(true)

      fund_codes = report.data.with_indifferent_access[:account_funds].map {|fund| fund.dig("code") }
      expect(fund_codes).to include("1234")
      expect(fund_codes).to include("1752")
      expect(fund_codes).to include("1930")

      expect(fund_codes).not_to include("2043")
    end

    it "includes all elements in a range separated by ..." do
      report.account_search_params = {fund_code: "1200...1950"}
      report.run_report(true)

      fund_codes = report.data.with_indifferent_access[:account_funds].map {|fund| fund.dig("code") }
      expect(fund_codes).to include("1234")
      expect(fund_codes).to include("1752")
      expect(fund_codes).to include("1930")

      expect(fund_codes).not_to include("2043")
    end

    it "includes all elements in a complex string" do
      skip "Not Sure why it's not seeing/parsing the string"
      report.account_search_params = {fund_code: "1930,1200...1799,200-500,981"}
      report.run_report(true)

      fund_codes = report.data.with_indifferent_access[:account_funds].map {|fund| fund.dig("code") }
      expect(fund_codes).to include("1234")
      expect(fund_codes).to include("1752")
      expect(fund_codes).to include("1930")

      expect(fund_codes).not_to include("2043")
    end
  end

  context "successfully parses account data" do
    it "parses a string with one account code" do
      expect(subject.parse_list_range_field("1390")).to eq(["1390"])
    end

    it "parses a string with an account code range" do
      expect(subject.parse_list_range_field("1300...1390")).to eq([1300..1390])
      expect(subject.parse_list_range_field("1300-1390")).to eq([1300..1390])
    end

    it "parses a string with an account code list" do
      expect(subject.parse_list_range_field("1390,9859,981")).to eq(%w[1390 9859 981])
    end

    it "parses with a list, single and range values" do
      expect(subject.parse_list_range_field("1390,1300...1390,200-500,981")).to eq(["1390", 1300..1390, 200..500,
                                                                                    "981"])
    end

    it "parses lists with spaces" do
      expect(subject.parse_list_range_field("1390, 1300...1390, 200-500, 981")).to eq(["1390", 1300..1390, 200..500,
                                                                                       "981"])
      expect(subject.parse_list_range_field("1390, 1300, 200, 981")).to eq(%w[1390 1300 200 981])
      expect(subject.parse_list_range_field("1300...1390, 200-500, 981...234, 34-1000")).to eq([1300..1390, 200..500,
                                                                                                981..234, 34..1000])
    end
  end

  context "#parse_account_range(range)" do
    it "parses a range into a range object" do
      ranges = subject.parse_account_range("1150-1200")
      range = ranges[0]

      expect(ranges).to be_a(Array)
      expect(ranges.length).to eql(1)

      expect(range).to be_a(Range)
      expect(range.min).to eql(1150)
      expect(range.max).to eql(1200)
    end

    it "parses a list of values" do
      ranges = subject.parse_account_range("7100-7299,7400-7499")

      expect(ranges).to be_a(Array)
      expect(ranges.length).to eql(2)

      expect(ranges[0].min).to eql(7100)
      expect(ranges[0].max).to eql(7299)

      expect(ranges[1].min).to eql(7400)
      expect(ranges[1].max).to eql(7499)
    end

    it "parses a single value into a range of 0-9 based on significant digit" do
      ranges = subject.parse_account_range("1000")
      range = ranges[0]

      expect(ranges).to be_a(Array)
      expect(ranges.length).to eql(1)

      expect(range).to be_a(Range)
      expect(range.min).to eql(1000)
      expect(range.max).to eql(1999)
    end
  end
end
