require 'rails_helper'

RSpec.describe "ApAgingReports", type: :request do
  describe "GET /ap_aging_reports" do
    it "works! (now write some real specs)" do
      get report_ap_aging_reports_path
      expect(response).to have_http_status(200)
    end
  end
end
