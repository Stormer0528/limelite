require "rails_helper"

RSpec.describe JournalEntriesController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/entries").to route_to("journal_entries#index")
    end

    it "routes to #new" do
      expect(:get => "/entries/new").to route_to("journal_entries#new")
    end

    it "routes to #show" do
      expect(:get => "/entries/1").to route_to("journal_entries#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/entries/1/edit").to route_to("journal_entries#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/entries").to route_to("journal_entries#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/entries/1").to route_to("journal_entries#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/entries/1").to route_to("journal_entries#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/entries/1").to route_to("journal_entries#destroy", :id => "1")
    end

  end
end
