require "rails_helper"

RSpec.describe PurchaseOrdersController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/purchase_orders").to route_to("purchase_orders#index")
    end

    it "routes to #new" do
      expect(:get => "/purchase_orders/new").to route_to("purchase_orders#new")
    end

    it "routes to #show" do
      expect(:get => "/purchase_orders/1").to route_to("purchase_orders#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/purchase_orders/1/edit").to route_to("purchase_orders#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/purchase_orders").to route_to("purchase_orders#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/purchase_orders/1").to route_to("purchase_orders#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/purchase_orders/1").to route_to("purchase_orders#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/purchase_orders/1").to route_to("purchase_orders#destroy", :id => "1")
    end

  end
end
