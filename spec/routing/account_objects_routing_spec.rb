require "rails_helper"

RSpec.describe AccountObjectsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/account_objects").to route_to("account_objects#index")
    end

    it "routes to #new" do
      expect(:get => "/account_objects/new").to route_to("account_objects#new")
    end

    it "routes to #show" do
      expect(:get => "/account_objects/1").to route_to("account_objects#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/account_objects/1/edit").to route_to("account_objects#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/account_objects").to route_to("account_objects#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/account_objects/1").to route_to("account_objects#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/account_objects/1").to route_to("account_objects#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/account_objects/1").to route_to("account_objects#destroy", :id => "1")
    end

  end
end
