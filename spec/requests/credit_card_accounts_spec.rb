require 'rails_helper'

RSpec.describe "CreditCards", type: :request do
  describe "GET /credit_cards" do
    it "works! (now write some real specs)" do
      get credit_cards_path
      expect(response).to have_http_status(200)
    end
  end
end
