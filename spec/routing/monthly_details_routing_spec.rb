require "rails_helper"

RSpec.describe MonthlyDetailsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/monthly_detail_reports").to route_to("monthly_detail_reports#index")
    end

    it "routes to #new" do
      expect(:get => "/monthly_detail_reports/new").to route_to("monthly_detail_reports#new")
    end

    it "routes to #show" do
      expect(:get => "/monthly_detail_reports/1").to route_to("monthly_detail_reports#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/monthly_detail_reports/1/edit").to route_to("monthly_detail_reports#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/monthly_detail_reports").to route_to("monthly_detail_reports#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/monthly_detail_reports/1").to route_to("monthly_detail_reports#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/monthly_detail_reports/1").to route_to("monthly_detail_reports#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/monthly_detail_reports/1").to route_to("monthly_detail_reports#destroy", :id => "1")
    end

  end
end
