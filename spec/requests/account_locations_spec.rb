require 'rails_helper'

RSpec.describe "AccountLocations", type: :request do
  describe "GET /account_locations" do
    it "works! (now write some real specs)" do
      get account_locations_path
      expect(response).to have_http_status(200)
    end
  end
end
