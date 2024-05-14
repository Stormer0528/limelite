require "rails_helper"

RSpec.describe BankAccountsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/bank_accounts").to route_to("bank_accounts#index")
    end

    it "routes to #new" do
      expect(:get => "/bank_accounts/new").to route_to("bank_accounts#new")
    end

    it "routes to #show" do
      expect(:get => "/bank_accounts/1").to route_to("bank_accounts#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/bank_accounts/1/edit").to route_to("bank_accounts#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/bank_accounts").to route_to("bank_accounts#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/bank_accounts/1").to route_to("bank_accounts#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/bank_accounts/1").to route_to("bank_accounts#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/bank_accounts/1").to route_to("bank_accounts#destroy", :id => "1")
    end

  end
end
