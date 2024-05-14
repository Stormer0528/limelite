require 'rails_helper'

RSpec.describe "AccountResources", type: :request do
  describe "GET /account_resources" do
    it "works! (now write some real specs)" do
      get account_resources_path
      expect(response).to have_http_status(200)
    end
  end
end
