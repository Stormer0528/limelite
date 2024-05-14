require 'rails_helper'

RSpec.describe "AccountGoals", type: :request do
  describe "GET /account_goals" do
    it "works! (now write some real specs)" do
      get account_goals_path
      expect(response).to have_http_status(200)
    end
  end
end
