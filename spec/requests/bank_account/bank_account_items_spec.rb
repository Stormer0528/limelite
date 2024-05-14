require 'rails_helper'

RSpec.describe "BankAccount::Items", type: :request do
  describe "GET /bank_account_items" do
    it "works! (now write some real specs)" do
      get bank_account_items_path
      expect(response).to have_http_status(200)
    end
  end
end
