require "rails_helper"

RSpec.describe AccountYearsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/account_years").to route_to("account_years#index")
    end

    it "routes to #new" do
      expect(:get => "/account_years/new").to route_to("account_years#new")
    end

    it "routes to #show" do
      expect(:get => "/account_years/1").to route_to("account_years#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/account_years/1/edit").to route_to("account_years#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/account_years").to route_to("account_years#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/account_years/1").to route_to("account_years#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/account_years/1").to route_to("account_years#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/account_years/1").to route_to("account_years#destroy", :id => "1")
    end

  end
end
