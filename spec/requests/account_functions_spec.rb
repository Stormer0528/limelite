require 'rails_helper'

RSpec.describe "AccountFunctions", type: :request do
  describe "GET /account_functions" do
    it "works! (now write some real specs)" do
      get account_functions_path
      expect(response).to have_http_status(200)
    end
  end
end
