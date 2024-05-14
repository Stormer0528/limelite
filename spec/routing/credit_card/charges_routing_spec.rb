require "rails_helper"

RSpec.describe CreditCardsController, type: :routing do
  describe "CreditCard/Charges routing" do
    it "routes #index to credit_cards#index" do
      expect(get: "/credit_cards/test/charges").to route_to(
        controller: "credit_cards",
        action: "index",
        other: "test/charges"
      )
    end

    it "routes #new to credit_cards#index" do
      expect(get: "/credit_cards/test/charges/new").to route_to(
        controller: "credit_cards",
        action: "index",
        other: "test/charges/new"
      )
    end

    it "routes #show to credit_cards#index" do
      expect(get: "/credit_cards/test/charges/1").to route_to(
        controller: "credit_cards",
        action: "index",
        other: "test/charges/1"
      )
    end

    it "routes #edit to credit_cards#index" do
      expect(get: "/credit_cards/test/charges/1/edit").to route_to(
        controller: "credit_cards",
        action: "index",
        other: "test/charges/1/edit"
      )
    end
  end
end
