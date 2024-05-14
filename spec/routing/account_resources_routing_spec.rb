require "rails_helper"

RSpec.describe AccountResourcesController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/account_resources").to route_to("account_resources#index")
    end

    it "routes to #new" do
      expect(:get => "/account_resources/new").to route_to("account_resources#new")
    end

    it "routes to #show" do
      expect(:get => "/account_resources/1").to route_to("account_resources#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/account_resources/1/edit").to route_to("account_resources#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/account_resources").to route_to("account_resources#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/account_resources/1").to route_to("account_resources#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/account_resources/1").to route_to("account_resources#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/account_resources/1").to route_to("account_resources#destroy", :id => "1")
    end

  end
end
