require "rails_helper"

RSpec.describe PaymentsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/payments").to route_to("payments#index")
    end

    it "routes to #new" do
      expect(:get => "/payments/new").to route_to("payments#new")
    end

    it "routes to #show" do
      expect(:get => "/payments/1").to route_to("payments#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/payments/1/edit").to route_to("payments#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/payments").to route_to("payments#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/payments/1").to route_to("payments#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/payments/1").to route_to("payments#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/payments/1").to route_to("payments#destroy", :id => "1")
    end

  end
end
