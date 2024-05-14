require 'rails_helper'

RSpec.describe "Invoices", type: :request do
  describe "GET /invoices" do
    it "works! (now write some real specs)" do
      get vendor_invoices_path(@vendor)
      expect(response).to have_http_status(200)
    end
  end
end
