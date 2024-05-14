require "rails_helper"

RSpec.describe CreditCardsController, type: :routing do
  describe "CreditCard/Payments routing" do
    it "routes #index to credit_cards#index" do
      expect(get: "/credit_cards/test/payments").to route_to(
        controller: "credit_cards",
        action: "index",
        other: "test/payments"
      )
    end

    it "routes #new to credit_cards#index" do
      expect(get: "/credit_cards/test/payments/new").to route_to(
        controller: "credit_cards",
        action: "index",
        other: "test/payments/new"
      )
    end

    it "routes #show to credit_cards#index" do
      expect(get: "/credit_cards/test/payments/1").to route_to(
        controller: "credit_cards",
        action: "index",
        other: "test/payments/1"
      )
    end

    it "routes #edit to credit_cards#index" do
      expect(get: "/credit_cards/test/payments/1/edit").to route_to(
        controller: "credit_cards",
        action: "index",
        other: "test/payments/1/edit"
      )
    end
  end
end
