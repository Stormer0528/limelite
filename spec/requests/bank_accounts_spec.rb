require 'rails_helper'

RSpec.describe "BankAccounts", type: :request do
  describe "GET /bank_accounts" do
    it "works! (now write some real specs)" do
      get bank_accounts_path
      expect(response).to have_http_status(200)
    end
  end
end
