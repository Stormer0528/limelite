require "rails_helper"

RSpec.describe BatchUploadsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/batch_uploads").to route_to("batch_uploads#index")
    end

    it "routes to #new" do
      expect(:get => "/batch_uploads/new").to route_to("batch_uploads#new")
    end

    it "routes to #show" do
      expect(:get => "/batch_uploads/1").to route_to("batch_uploads#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/batch_uploads/1/edit").to route_to("batch_uploads#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/batch_uploads").to route_to("batch_uploads#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/batch_uploads/1").to route_to("batch_uploads#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/batch_uploads/1").to route_to("batch_uploads#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/batch_uploads/1").to route_to("batch_uploads#destroy", :id => "1")
    end

  end
end
