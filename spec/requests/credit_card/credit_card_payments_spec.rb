require 'rails_helper'

RSpec.describe "CreditCard::Payments", type: :request do
  describe "GET /credit_card_payments" do
    it "works! (now write some real specs)" do
      get credit_card_payments_path
      expect(response).to have_http_status(200)
    end
  end
end
