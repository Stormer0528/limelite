require "rails_helper"

RSpec.describe BankAccount::ItemsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/bank_account/items").to route_to("bank_account/items#index")
    end

    it "routes to #new" do
      expect(:get => "/bank_account/items/new").to route_to("bank_account/items#new")
    end

    it "routes to #show" do
      expect(:get => "/bank_account/items/1").to route_to("bank_account/items#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/bank_account/items/1/edit").to route_to("bank_account/items#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/bank_account/items").to route_to("bank_account/items#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/bank_account/items/1").to route_to("bank_account/items#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/bank_account/items/1").to route_to("bank_account/items#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/bank_account/items/1").to route_to("bank_account/items#destroy", :id => "1")
    end

  end
end
