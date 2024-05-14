require "rails_helper"

RSpec.describe Report::Vendor1099ReportsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(:get => "/report/vendor1099_reports").to route_to("report/vendor1099_reports#index")
    end

    it "routes to #new" do
      expect(:get => "/report/vendor1099_reports/new").to route_to("report/vendor1099_reports#new")
    end

    it "routes to #show" do
      expect(:get => "/report/vendor1099_reports/1").to route_to("report/vendor1099_reports#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/report/vendor1099_reports/1/edit").to route_to("report/vendor1099_reports#edit", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/report/vendor1099_reports").to route_to("report/vendor1099_reports#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/report/vendor1099_reports/1").to route_to("report/vendor1099_reports#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/report/vendor1099_reports/1").to route_to("report/vendor1099_reports#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/report/vendor1099_reports/1").to route_to("report/vendor1099_reports#destroy", :id => "1")
    end
  end
end
