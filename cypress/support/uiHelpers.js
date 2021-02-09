Cypress.Commands.add("loadTab", (tabId, verifyId) => {
  cy.get("#" + tabId)
    .should("exist")
    .click();
  cy.get("#" + verifyId, { timeout: 5000 }).should("exist");
});

Cypress.Commands.add("loadPerson", (name) => {
  cy.get("#searchText").type(name);
  cy.get("#searchButton").click();
  cy.get("body").should("contain", name);
  cy.get("a:contains('" + name + "')").click();
  cy.get("h2").should("contain", name);
});

Cypress.Commands.add("containsAll", (selector, values) => {
  cy.get(selector).should("exist");
  values.map((v) => cy.get(selector).contains(v));
});

Cypress.Commands.add("enterText", (selector, text) => {
  cy.get(selector).should("exist").should("not.be.disabled").clear();
  cy.get(selector).type(text);
});

Cypress.Commands.add("notContainAll", (selector, values) => {
  cy.get(selector).should("exist");
  values.map((v) => cy.get(selector).should("not.contain", v));
});

Cypress.Commands.add("containsClick", (selector) => {
  cy.get(`a:contains('${selector}')`).should("exist").click();
});

Cypress.Commands.add("visitAndVerify", (route) => {
  cy.visit(route);
  cy.verifyRoute(route);
});

Cypress.Commands.add("verifyRoute", (route) => {
  cy.location("pathname").should("exist").should("contain", route);
});

Cypress.Commands.add("selectOption", (selector, value) => {
  cy.get(selector).should('exist').select(value);   
})