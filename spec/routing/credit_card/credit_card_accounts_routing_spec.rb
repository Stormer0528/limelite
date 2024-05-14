require "rails_helper"

RSpec.describe CreditCardsController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/credit_cards").to route_to("credit_cards#index")
    end

    it "routes to #new" do
      expect(get: "/credit_cards/new").to route_to("credit_cards#new")
    end

    it "routes to #show" do
      expect(get: "/credit_cards/1").to route_to("credit_cards#index", other: "1")
    end

    it "routes to #edit" do
      expect(get: "/credit_cards/1/edit").to route_to("credit_cards#edit", id: "1")
    end

    it "routes to #create" do
      expect(post: "/credit_cards").to route_to("credit_cards#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/credit_cards/1").to route_to("credit_cards#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/credit_cards/1").to route_to("credit_cards#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/credit_cards/1").to route_to("credit_cards#destroy", id: "1")
    end
  end
end
