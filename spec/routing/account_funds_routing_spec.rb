require "rails_helper"

RSpec.describe AccountFundsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/account_funds").to route_to("account_funds#index")
    end

    it "routes to #new" do
      expect(:get => "/account_funds/new").to route_to("account_funds#new")
    end

    it "routes to #show" do
      expect(:get => "/account_funds/1").to route_to("account_funds#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/account_funds/1/edit").to route_to("account_funds#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/account_funds").to route_to("account_funds#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/account_funds/1").to route_to("account_funds#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/account_funds/1").to route_to("account_funds#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/account_funds/1").to route_to("account_funds#destroy", :id => "1")
    end

  end
end
