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
    const baseUrl = "/admin/users";
    beforeEach(() => {
      Cypress.Cookies.preserveOnce("_savant_co_session", "fiscal_year");
      cy.visit(baseUrl);
    });

    it("can visit the page", () => {
      cy.location("pathname").should("contains", "/admin/users");
      const $tabs = cy.get('[data-cy="user-tabs"]');
      $tabs.should("be.visible");
    });

    xit("Breadcrumb", () => {
      cy.visit(baseUrl);
      cy.get(".breadcrumb").should("have.text", "User Account");
    });

    it("Tabs", () => {
      cy.visit(baseUrl);

      cy.get('[data-cy="user-groups-tab"]').click();
      cy.get('[data-cy="user-groups-tab"]').should(
        "contain.text",
        "User Groups"
      );
      // cy.get('[data-cy="user-groups-table"]').should("be.visible");

      cy.get('[data-cy="users-tab"]').click();
      cy.get('[data-cy="users-tab"]').should("contain.text", "Users");
      // cy.get('[data-cy="admin-user-table"]').should("be.visible");
    });

    xit("FAB", () => {});
  });
});
