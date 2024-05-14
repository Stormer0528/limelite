require "rails_helper"

RSpec.describe Organizations::FiscalYearController, type: :controller do
  describe "GET #update" do
    it "returns http success" do
      get :update
      expect(response).to have_http_status(:success)
    end
  end
end
