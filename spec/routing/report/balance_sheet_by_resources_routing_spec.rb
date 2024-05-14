require "rails_helper"

RSpec.describe Report::BalanceSheetByResourcesController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/report/balance_sheet_by_resources").to route_to("report/balance_sheet_by_resources#index")
    end

    it "routes to #new" do
      expect(:get => "/report/balance_sheet_by_resources/new").to route_to("report/balance_sheet_by_resources#new")
    end

    it "routes to #show" do
      expect(:get => "/report/balance_sheet_by_resources/1").to route_to("report/balance_sheet_by_resources#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/report/balance_sheet_by_resources/1/edit").to route_to("report/balance_sheet_by_resources#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/report/balance_sheet_by_resources").to route_to("report/balance_sheet_by_resources#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/report/balance_sheet_by_resources/1").to route_to("report/balance_sheet_by_resources#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/report/balance_sheet_by_resources/1").to route_to("report/balance_sheet_by_resources#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/report/balance_sheet_by_resources/1").to route_to("report/balance_sheet_by_resources#destroy", :id => "1")
    end
  end
end
