require 'rails_helper'

RSpec.describe "Files", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/files/index"
      expect(response).to have_http_status(:success)
    end
  end

end
