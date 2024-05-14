require "rails_helper"

RSpec.describe AccountLocationsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/account_locations").to route_to("account_locations#index")
    end

    it "routes to #new" do
      expect(:get => "/account_locations/new").to route_to("account_locations#new")
    end

    it "routes to #show" do
      expect(:get => "/account_locations/1").to route_to("account_locations#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/account_locations/1/edit").to route_to("account_locations#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/account_locations").to route_to("account_locations#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/account_locations/1").to route_to("account_locations#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/account_locations/1").to route_to("account_locations#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/account_locations/1").to route_to("account_locations#destroy", :id => "1")
    end

  end
end
