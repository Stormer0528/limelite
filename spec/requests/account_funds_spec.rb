require 'rails_helper'

RSpec.describe "AccountFunds", type: :request do
  describe "GET /account_funds" do
    it "works! (now write some real specs)" do
      get account_funds_path
      expect(response).to have_http_status(200)
    end
  end
end
