require "rails_helper"

RSpec.describe Report::BalanceSheetsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/report/balance_sheets").to route_to("report/balance_sheets#index")
    end

    it "routes to #new" do
      expect(:get => "/report/balance_sheets/new").to route_to("report/balance_sheets#new")
    end

    it "routes to #show" do
      expect(:get => "/report/balance_sheets/1").to route_to("report/balance_sheets#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/report/balance_sheets/1/edit").to route_to("report/balance_sheets#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/report/balance_sheets").to route_to("report/balance_sheets#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/report/balance_sheets/1").to route_to("report/balance_sheets#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/report/balance_sheets/1").to route_to("report/balance_sheets#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/report/balance_sheets/1").to route_to("report/balance_sheets#destroy", :id => "1")
    end

  end
end
