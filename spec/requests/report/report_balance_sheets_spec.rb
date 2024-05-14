require 'rails_helper'

RSpec.describe "Report::BalanceSheets", type: :request do
  describe "GET /report_balance_sheets" do
    it "works! (now write some real specs)" do
      get report_balance_sheets_path
      expect(response).to have_http_status(200)
    end
  end
end
