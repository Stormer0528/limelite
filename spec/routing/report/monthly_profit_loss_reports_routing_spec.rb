require "rails_helper"

RSpec.describe Report::MonthlyProfitLossReportsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/report/monthly_profit_loss_reports").to route_to("report/monthly_profit_loss_reports#index")
    end

    it "routes to #new" do
      expect(:get => "/report/monthly_profit_loss_reports/new").to route_to("report/monthly_profit_loss_reports#new")
    end

    it "routes to #show" do
      expect(:get => "/report/monthly_profit_loss_reports/1").to route_to("report/monthly_profit_loss_reports#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/report/monthly_profit_loss_reports/1/edit").to route_to("report/monthly_profit_loss_reports#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/report/monthly_profit_loss_reports").to route_to("report/monthly_profit_loss_reports#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/report/monthly_profit_loss_reports/1").to route_to("report/monthly_profit_loss_reports#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/report/monthly_profit_loss_reports/1").to route_to("report/monthly_profit_loss_reports#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/report/monthly_profit_loss_reports/1").to route_to("report/monthly_profit_loss_reports#destroy", :id => "1")
    end
  end
end
