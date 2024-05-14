require "rails_helper"

RSpec.describe Report::ProfitAndLossStatementsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/report/profit_and_loss_statements").to route_to("report/profit_and_loss_statements#index")
    end

    it "routes to #new" do
      expect(:get => "/report/profit_and_loss_statements/new").to route_to("report/profit_and_loss_statements#new")
    end

    it "routes to #show" do
      expect(:get => "/report/profit_and_loss_statements/1").to route_to("report/profit_and_loss_statements#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/report/profit_and_loss_statements/1/edit").to route_to("report/profit_and_loss_statements#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/report/profit_and_loss_statements").to route_to("report/profit_and_loss_statements#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/report/profit_and_loss_statements/1").to route_to("report/profit_and_loss_statements#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/report/profit_and_loss_statements/1").to route_to("report/profit_and_loss_statements#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/report/profit_and_loss_statements/1").to route_to("report/profit_and_loss_statements#destroy", :id => "1")
    end

  end
end
