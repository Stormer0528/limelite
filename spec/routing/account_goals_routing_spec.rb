require "rails_helper"

RSpec.describe AccountGoalsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/account_goals").to route_to("account_goals#index")
    end

    it "routes to #new" do
      expect(:get => "/account_goals/new").to route_to("account_goals#new")
    end

    it "routes to #show" do
      expect(:get => "/account_goals/1").to route_to("account_goals#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/account_goals/1/edit").to route_to("account_goals#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/account_goals").to route_to("account_goals#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/account_goals/1").to route_to("account_goals#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/account_goals/1").to route_to("account_goals#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/account_goals/1").to route_to("account_goals#destroy", :id => "1")
    end

  end
end
