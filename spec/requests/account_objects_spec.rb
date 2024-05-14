require 'rails_helper'

RSpec.describe "AccountObjects", type: :request do
  describe "GET /account_objects" do
    it "works! (now write some real specs)" do
      get account_objects_path
      expect(response).to have_http_status(200)
    end
  end
end
