require 'rails_helper'

RSpec.describe "MonthlyDetails", type: :request do
  describe "GET /monthly_detail_reports" do
    it "works! (now write some real specs)" do
      get monthly_detail_report_path
      expect(response).to have_http_status(200)
    end
  end
end
