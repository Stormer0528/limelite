require 'rails_helper'

RSpec.describe "Report::MonthlyProfitLossReports", type: :request do
  describe "GET /report_monthly_profit_loss_reports" do
    it "works! (now write some real specs)" do
      get report_monthly_profit_loss_reports_path
      expect(response).to have_http_status(200)
    end
  end
end
