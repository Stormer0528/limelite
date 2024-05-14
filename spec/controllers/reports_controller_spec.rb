require 'rails_helper'

RSpec.describe ReportsController, type: :controller do
  include Devise::Test::ControllerHelpers

  describe "GET #index" do
    before do
      @request.env["devise.mapping"] = Devise.mappings[:admin]
      sign_in create(:super_admin_user)
    end

    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
    end

    it "renders the index template" do
      get :index
      expect(response).to render_template(:index)
      expect(response.body).to eq ""
    end
  end
end
