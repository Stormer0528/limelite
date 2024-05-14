require "rails_helper"

RSpec.describe CashFlowReportsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/cash_flow_reports").to route_to("cash_flow_reports#index")
    end

    it "routes to #new" do
      expect(:get => "/cash_flow_reports/new").to route_to("cash_flow_reports#new")
    end

    it "routes to #show" do
      expect(:get => "/cash_flow_reports/1").to route_to("cash_flow_reports#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/cash_flow_reports/1/edit").to route_to("cash_flow_reports#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/cash_flow_reports").to route_to("cash_flow_reports#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/cash_flow_reports/1").to route_to("cash_flow_reports#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/cash_flow_reports/1").to route_to("cash_flow_reports#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/cash_flow_reports/1").to route_to("cash_flow_reports#destroy", :id => "1")
    end

  end
end
