/// <reference types="cypress" />

describe("Current User Page", () => {
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

  describe("#show", () => {
    beforeEach(() => {
      Cypress.Cookies.preserveOnce("_savant_co_session", "fiscal_year");
      cy.visit(baseUrl);
    });
    const baseUrl = "/user";

    it("can visit the page", () => {
      cy.location("pathname").should("contains", "/user");
      const $header = cy.get('[data-cy="page-header"]');
      $header.should("have.text", " User Account");
      $header.should("be.visible");
    });

    it("Breadcrumb", () => {
      cy.visit(baseUrl);
      cy.get(".breadcrumb").should("have.text", "User Account");
    });

    it("Tabs", () => {
      cy.visit(baseUrl);

      cy.get('[data-cy="files-tab"]').click();
      cy.get('[data-cy="files-tab"]').should("contain.text", "Uploaded Files");
      cy.get('[data-cy="file-uploads-table"]').should("be.visible");

      cy.get('[data-cy="detail-tab"]').click();
      cy.get('[data-cy="detail-tab"]').should("contain.text", "User Details");
      cy.get('[data-cy="user-details-table"]').should("be.visible");

      cy.get('[data-cy="auth-tab"]').click();
      cy.get('[data-cy="auth-tab"]').should(
        "contain.text",
        "Pending Authorizations"
      );
      cy.get('[data-cy="authorizations-table"]').should("be.visible");
    });
  });
});
