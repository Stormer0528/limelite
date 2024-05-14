require "rails_helper"

RSpec.describe ApAgingReportsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/ap_aging_reports").to route_to("ap_aging_reports#index")
    end

    it "routes to #new" do
      expect(:get => "/ap_aging_reports/new").to route_to("ap_aging_reports#new")
    end

    it "routes to #show" do
      expect(:get => "/ap_aging_reports/1").to route_to("ap_aging_reports#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/ap_aging_reports/1/edit").to route_to("ap_aging_reports#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/ap_aging_reports").to route_to("ap_aging_reports#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/ap_aging_reports/1").to route_to("ap_aging_reports#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/ap_aging_reports/1").to route_to("ap_aging_reports#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/ap_aging_reports/1").to route_to("ap_aging_reports#destroy", :id => "1")
    end

  end
end
