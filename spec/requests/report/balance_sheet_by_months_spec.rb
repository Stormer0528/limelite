require 'rails_helper'

RSpec.describe "Report::BalanceSheetByMonths", type: :request do
  describe "GET /report/balance_sheet_by_months" do
    it "works! (now write some real specs)" do
      get report_balance_sheet_by_months_path
      expect(response).to have_http_status(200)
    end
  end
end
