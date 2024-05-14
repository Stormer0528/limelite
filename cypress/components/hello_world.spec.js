import React from "react";
import {mount} from "@cypress/react";
import HelloWorld from "../../app/javascript/components/hello_world.js";
describe("HelloWorld component", () => {
  it("works", () => {
    mount(<HelloWorld />);
    // now use standard Cypress commands
    cy.contains("Hello World!").should("be.visible");
  });
});
