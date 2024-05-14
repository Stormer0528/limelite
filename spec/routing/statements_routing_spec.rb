require "rails_helper"

RSpec.describe StatementsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/statements").to route_to("statements#index")
    end

    it "routes to #new" do
      expect(:get => "/statements/new").to route_to("statements#new")
    end

    it "routes to #show" do
      expect(:get => "/statements/1").to route_to("statements#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/statements/1/edit").to route_to("statements#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/statements").to route_to("statements#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/statements/1").to route_to("statements#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/statements/1").to route_to("statements#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/statements/1").to route_to("statements#destroy", :id => "1")
    end

  end
end
