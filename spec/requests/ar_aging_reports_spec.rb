require 'rails_helper'

RSpec.describe "ArAgingReports", type: :request do
  describe "GET /ar_aging_reports" do
    it "works! (now write some real specs)" do
      get ar_aging_reports_path
      expect(response).to have_http_status(200)
    end
  end
end
