require "rails_helper"

RSpec.describe VendorsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/vendors").to route_to("vendors#index")
    end

    it "routes to #new" do
      expect(:get => "/vendors/new").to route_to("vendors#new")
    end

    it "routes to #show" do
      expect(:get => "/vendors/1").to route_to("vendors#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/vendors/1/edit").to route_to("vendors#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/vendors").to route_to("vendors#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/vendors/1").to route_to("vendors#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/vendors/1").to route_to("vendors#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/vendors/1").to route_to("vendors#destroy", :id => "1")
    end

  end
end
