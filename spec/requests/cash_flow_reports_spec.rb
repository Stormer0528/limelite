require 'rails_helper'

RSpec.describe "CashFlowReports", type: :request do
  describe "GET /cash_flow_reports" do
    it "works! (now write some real specs)" do
      get cash_flow_reports_path
      expect(response).to have_http_status(200)
    end
  end
end
