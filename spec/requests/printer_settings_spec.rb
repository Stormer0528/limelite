require 'rails_helper'

RSpec.describe "PrinterSettings", type: :request do
  describe "GET /printer_settings" do
    it "works! (now write some real specs)" do
      get printer_settings_path
      expect(response).to have_http_status(200)
    end
  end
end
