require 'rails_helper'

RSpec.describe "Report::CashFlowReportByMonths", type: :request do
  describe "GET /report/cash_flow_report_by_months" do
    it "works! (now write some real specs)" do
      get report_cash_flow_report_by_months_path
      expect(response).to have_http_status(200)
    end
  end
end
