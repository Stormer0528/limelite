require "rails_helper"

RSpec.describe Report::BalanceSheetByMonthsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/report/balance_sheet_by_months").to route_to("report/balance_sheet_by_months#index")
    end

    it "routes to #new" do
      expect(:get => "/report/balance_sheet_by_months/new").to route_to("report/balance_sheet_by_months#new")
    end

    it "routes to #show" do
      expect(:get => "/report/balance_sheet_by_months/1").to route_to("report/balance_sheet_by_months#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/report/balance_sheet_by_months/1/edit").to route_to("report/balance_sheet_by_months#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/report/balance_sheet_by_months").to route_to("report/balance_sheet_by_months#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/report/balance_sheet_by_months/1").to route_to("report/balance_sheet_by_months#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/report/balance_sheet_by_months/1").to route_to("report/balance_sheet_by_months#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/report/balance_sheet_by_months/1").to route_to("report/balance_sheet_by_months#destroy", :id => "1")
    end
  end
end
