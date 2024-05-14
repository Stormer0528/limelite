require "rails_helper"

RSpec.describe ArAgingReportsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/ar_aging_reports").to route_to("ar_aging_reports#index")
    end

    it "routes to #new" do
      expect(:get => "/ar_aging_reports/new").to route_to("ar_aging_reports#new")
    end

    it "routes to #show" do
      expect(:get => "/ar_aging_reports/1").to route_to("ar_aging_reports#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/ar_aging_reports/1/edit").to route_to("ar_aging_reports#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/ar_aging_reports").to route_to("ar_aging_reports#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/ar_aging_reports/1").to route_to("ar_aging_reports#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/ar_aging_reports/1").to route_to("ar_aging_reports#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/ar_aging_reports/1").to route_to("ar_aging_reports#destroy", :id => "1")
    end

  end
end
