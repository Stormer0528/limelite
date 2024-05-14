require 'rails_helper'

RSpec.describe "Payments", type: :request do
  describe "GET /payments" do
    it "works! (now write some real specs)" do
      get payments_path
      expect(response).to have_http_status(200)
    end
  end
end
