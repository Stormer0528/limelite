/// <reference types="cypress" />

describe("CreditCard/Charges", () => {
  before("Login and visit page...", () => {
    const email = "cypress@test.com";
    const password = "The Password 14112";

    cy.visit("/users/sign_in");

    cy.window().then((win) => {
      if (win.location.pathname !== "/") {
        cy.get("#user_email").type(email, {delay: 0, force: true});
        cy.get("#user_password").type(password, {delay: 0, force: true});

        cy.get(".waves-button-input").click();
      }
    });

    Cypress.Cookies.preserveOnce("_savant_co_session", "fiscal_year");
  });

  describe("Routing", () => {
    const CC_SLUG = "test";
    const baseUrl = `/credit_cards/${CC_SLUG}/charges`;

    beforeEach(() => {
      // before each test, we can automatically preserve the
      // '_savant_co_session' and 'fiscal_year' cookies. this means they
      // will not be cleared before the NEXT test starts.

      Cypress.Cookies.preserveOnce("_savant_co_session", "fiscal_year");
    });

    it("redirects to the CreditCard#show page when attempting to view index", () => {
      cy.visit(baseUrl);
      cy.location("pathname").should("contain", `/credit_cards/${CC_SLUG}`);
    });

    it("loads the new charge on charges/new", () => {
      cy.visit(baseUrl + "/new");
      cy.location("pathname").should("contain", `/credit_cards/${CC_SLUG}/new`);
    });

    it("loads the charges#show page on charges/:id", () => {
      cy.visit(baseUrl + "/1");
      cy.location("pathname").should("contain", `/credit_cards/${CC_SLUG}/1`);
    });

    it("loads the charges#show page on charges/:id/edit", () => {
      cy.visit(baseUrl + "/1/edit");
      cy.location("pathname").should(
        "contain",
        `/credit_cards/${CC_SLUG}/1/edit`
      );
    });
  });
});
