require 'rails_helper'

RSpec.describe PrintChecksController, type: :controller do

  describe "GET #configure" do
    it "returns http success" do
      get :configure
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #print" do
    it "returns http success" do
      get :print
      expect(response).to have_http_status(:success)
    end
  end

end
