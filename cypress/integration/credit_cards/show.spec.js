/// <reference types="cypress" />

describe("CreditCards", () => {
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

  describe("#index", () => {
    const CC_SLUG = "test";
    const baseUrl = `/credit_cards/${CC_SLUG}`;

    beforeEach(() => {
      // before each test, we can automatically preserve the
      // '_savant_co_session' and 'fiscal_year' cookies. this means they
      // will not be cleared before the NEXT test starts.

      Cypress.Cookies.preserveOnce("_savant_co_session", "fiscal_year");
      cy.visit(baseUrl);
    });

    it("can visit the page", () => {
      cy.visit(baseUrl);
      cy.location("pathname").should("contains", `/credit_cards/${CC_SLUG}`);
    });

    describe("Breadcrumb", () => {
      // cy.get(':nth-child(1) > .credit-card-index-0\.17588976848731375-MuiButtonBase-root > .credit-card-index-0\.17588976848731375-MuiButton-label')
    });

    describe("NavLinks", () => {
      it("Links to the CreditCard#index", () => {
        const $link = cy.get('[data-cy="cc-index-link"]');

        $link.invoke("attr", "href").should("equal", "/credit_cards/");
        cy.get('[data-cy="cc-index-link"]').click();
        cy.location("pathname").should("equal", `/credit_cards/`);
      });

      it("Links to the CreditCard#edit", () => {
        cy.get('[data-cy="cc-edit-link"]')
          .invoke("attr", "href")
          .should("equal", `/credit_cards/${CC_SLUG}/edit`);
      });

      it("Links to the CreditCard/Reconciliations", () => {
        cy.get('[data-cy="cc-reconciliations-link"]')
          .invoke("attr", "href")
          .should("equal", `/credit_cards/${CC_SLUG}/reconciliations`);
      });
    });

    describe("AccountStatus Header", () => {
      it("has dropdown items for each account", () => {
        cy.get('[data-cy="cc-header-select"]').click();
        cy.get('[data-cy="cc-header-select-menu"]')
          .find("li")
          .should("have.length", 2);
      });

      it("expands the header when clicked", () => {
        cy.get('[data-cy="cc-header"] > div:first')
          .invoke("attr", "aria-expanded")
          .should("equal", "false");

        cy.get('[data-cy="cc-header"] > div:first')
          .click()
          .invoke("attr", "aria-expanded")
          .should("eql", "true");
      });

      it("navigates to a new account when selected on a dropdown", () => {
        cy.get('[data-cy="cc-header-select"]').click();
        cy.get('[data-cy="cc-header-select-menu"]')
          .find("li")
          .contains("Test Credit Card")
          .click();
        cy.location("pathname").should(
          "equal",
          `/credit_cards/test-credit-card/reconciliations`
        );
      });
    });

    describe("FAB", () => {
      it("links to the new reconciliation page for the current credit card", () => {
        cy.get('[data-cy="cc-FabLink"]')
          .invoke("attr", "href")
          .should("equal", `${baseUrl}/new`);
      });

      xit("navigats to the new reconciliation page when the plus btn is clicked", () => {
        cy.get('[data-cy="cc-fab"]').click();
        cy.location("pathname").should("equal", `${baseUrl}/new`);
      });
    });

    describe("Items Ledger", () => {
      // cy.get(':nth-child(1) > .credit-card-index-0\.17588976848731375-MuiButtonBase-root > .credit-card-index-0\.17588976848731375-MuiButton-label')
      xit("clicking + reconciliation header goes to new reconciliation page");
      xit("show links link to reconcliation show pages");
      xit("edit links link to reconcliation edit pages");
    });
  });
});
