/// <reference types="cypress" />
describe("Login and visit page...", () => {
  const email = "cypress@test.com";
  const password = "The Password 14112";

  Cypress.Commands.add("visitOrLogin", (url) => {
    cy.visit(url);

    if (cy.url() === Cypress.config().baseUrl + "/users/sign_in") {
      cy.get("#user_email").click();
      cy.get("#user_email").type(email);
      cy.get(".password:nth-child(2)").click();
      cy.get("#user_password").click();
      cy.get("#user_password").type(password);

      cy.get(".waves-button-input").click();
    }

    cy.visit(url);
  });

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

  describe("Entry#edit", () => {
    it("Clicking add item btn adds an item", () => {
      cy.visit("/entries/77231/edit");
      const entryItemsLength = cy.get(".EntryItems").length;

      cy.get(".EntryItemsContainer button").click();

      cy.get(".EntryItems")
        .length()
        .should("eq", entryItemsLength + 1);
    });
  });

  it("Edit the entry form", () => {
    // Start on home page
    cy.visit("/entries/77231/edit");
    cy.get(
      ".Mui-focused > .entry-input-0.6821393420222215-MuiInputBase-input"
    ).click();
    cy.get(
      ".Mui-focused > .entry-input-0.6821393420222215-MuiInputBase-input"
    ).type("{leftarrow}");
    cy.get(".dirty:nth-child(1)").type("$22,341.49");
    cy.get(
      ".Mui-focused > .entry-input-0.6821393420222215-MuiInputBase-input"
    ).click();
    cy.get(
      ".Mui-focused > .entry-input-0.6821393420222215-MuiInputBase-input"
    ).type("$298.00");
    cy.get(
      ".Mui-focused > .entry-input-0.6821393420222215-MuiInputBase-input"
    ).click();
    cy.get(
      ".Mui-focused > .entry-input-0.6821393420222215-MuiInputBase-input"
    ).type("$500.00");
    cy.get(
      ".entry-input-0.6821393420222215-MuiButtonBase-root:nth-child(3) > .entry-input-0.6821393420222215-MuiButton-label"
    ).click();
    cy.get(
      ".entry-input-0.6821393420222215-makeStyles-creditContainer-79:nth-child(4) > .entry-input-0.6821393420222215-MuiFormControl-root"
    ).click();
    cy.get(
      ".Mui-focused > .entry-input-0.6821393420222215-MuiInputBase-input"
    ).click();
    cy.get(
      ".Mui-focused > .entry-input-0.6821393420222215-MuiInputBase-input"
    ).type("$1,396.75");
    cy.get(
      ".entry-input-0.6821393420222215-EntryItemForm-account-63:nth-child(1) input:nth-child(1)"
    ).click();
    cy.get(
      ".entry-input-0.6821393420222215-EntryItemForm-account-63:nth-child(1) input:nth-child(1)"
    ).type("1971");
    cy.get(
      ".entry-input-0.6821393420222215-EntryItemForm-account-63:nth-child(1) input:nth-child(11)"
    ).click();
    cy.get(".dirty:nth-child(11)").type("9500");
    cy.get(".blue-text > .waves-button-input").click();
    cy.get("#edit_entry_77231").submit();
  });
});
