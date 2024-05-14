require "rails_helper"

RSpec.describe AccountFunctionsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/account_functions").to route_to("account_functions#index")
    end

    it "routes to #new" do
      expect(:get => "/account_functions/new").to route_to("account_functions#new")
    end

    it "routes to #show" do
      expect(:get => "/account_functions/1").to route_to("account_functions#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/account_functions/1/edit").to route_to("account_functions#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/account_functions").to route_to("account_functions#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/account_functions/1").to route_to("account_functions#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/account_functions/1").to route_to("account_functions#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/account_functions/1").to route_to("account_functions#destroy", :id => "1")
    end

  end
end
