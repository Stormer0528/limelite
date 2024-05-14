/// <reference types="Cypress" />
// Profit and Loss Statement

describe("Profit and Loss Statement report runs", () => {
  const email = "cypress@test.com";
  const password = "The Password 14112";

  Cypress.Commands.add("loginByCSRF", (csrfToken) => {
    cy.request({
      method: "POST",
      url: "/users/sign_in",
      failOnStatusCode: false, // dont fail so we can make assertions
      form: true, // we are submitting a regular form body
      body: {
        "user[email]": email,
        "user[password]": password,
        _csrf: csrfToken, // insert this as part of form body
      },
    });
  });

  it("strategy #1: parse token from HTML", function () {
    // if we cannot change our server code to make it easier
    // to parse out the CSRF token, we can simply use cy.request
    // to fetch the login page, and then parse the HTML contents
    // to find the CSRF token embedded in the page
    cy.request("/")
      .its("body")
      .then((body) => {
        // we can use Cypress.$ to parse the string body
        // thus enabling us to query into it easily
        const $html = Cypress.$(body);
        const csrf = $html.find("input[name=_csrf]").val();

        cy.loginByCSRF(csrf).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body).to.include("<h2>dashboard.html</h2>");
        });
      });

    // successful "cy.request" sets all returned cookies, thus we should
    // be able to visit the protected page - we are logged in!
    // visitDashboard();
  });

  // it("Runs the report when run btn is clicked", () => {
  //   cy.visit(
  //     "http://rja.limeliteds.local:3000/reports/profit-and-loss-statement"
  //   );
  // });
});
