require "rails_helper"

RSpec.describe PrinterSettingsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/printer_settings").to route_to("printer_settings#index")
    end

    it "routes to #new" do
      expect(:get => "/printer_settings/new").to route_to("printer_settings#new")
    end

    it "routes to #show" do
      expect(:get => "/printer_settings/1").to route_to("printer_settings#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/printer_settings/1/edit").to route_to("printer_settings#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/printer_settings").to route_to("printer_settings#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/printer_settings/1").to route_to("printer_settings#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/printer_settings/1").to route_to("printer_settings#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/printer_settings/1").to route_to("printer_settings#destroy", :id => "1")
    end

  end
end
