require 'rails_helper'

RSpec.describe "Accounts", type: :request do
  describe "GET /accounts" do
    it "works! (now write some real specs)" do
      get accounts_path
      expect(response).to have_http_status(200)
    end
  end
end
