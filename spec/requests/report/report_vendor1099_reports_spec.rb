require 'rails_helper'

RSpec.describe "Report::Vendor1099Reports", type: :request do
  describe "GET /report_vendor1099_reports" do
    it "works! (now write some real specs)" do
      get report_vendor1099_reports_path
      expect(response).to have_http_status(200)
    end
  end
end
