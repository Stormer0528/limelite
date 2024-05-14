/// <reference types="cypress" />

describe("Login and visit page...", () => {
  const email = "cypress@test.com";
  const password = "The Password 14112";

  before(() => {
    cy.visit("/users/sign_in");

    cy.get("#user_email").click();
    cy.get("#user_email").type(email);
    cy.get(".password:nth-child(2)").click();
    cy.get("#user_password").click();
    cy.get("#user_password").type(password);

    cy.get(".waves-button-input").click();

    Cypress.Cookies.preserveOnce("_savant_co_session", "fiscal_year");
  });

  describe("Entry#show", () => {
    it("Clicking edit btn goes to edit view", () => {
      cy.visit("/entries/77231");
      cy.get("#editBtn").click();
      cy.url().should("contains", "/entries/77231/edit");
    });

    it("Entries#import_entries", function () {
      cy.visit("/entries/77231");
      cy.get(".menu-link > .material-icons").click();
      cy.get(".NewEntryBtn > span").click();
      cy.contains("Upload Entries").click();

      cy.url().should("contains", "/admin/import-entries");
    });
  });
});
