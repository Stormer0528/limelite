require 'rails_helper'

RSpec.describe "Report::ProfitAndLossStatements", type: :request do
  describe "GET /report_profit_and_loss_statements" do
    it "works! (now write some real specs)" do
      get report_profit_and_loss_statements_path
      expect(response).to have_http_status(200)
    end
  end
end
