context("Authentication", () => {
    signIn();
    signOut();
    alreadyLoggedIn();
    notLoggedIn();
})

function signIn() {
    it("Sign in", () => {
        cy.visit("/login");
        cy.get("[data-cy=sign-in-call-to-action]").should('exist');
        cy.enterText("[data-cy=email]", Cypress.env("email"));
        cy.enterText("[data-cy=password]", Cypress.env("password"));
        cy.get("[data-cy=sign-in-button]").should('exist').click();
        cy.verifyRoute("/people");
    })
}

function signOut() {
    it("Sign out", () => {
        cy.login();
        cy.visitAndVerify("/people");
        cy.get("[data-cy=settings-dropdown").should('exist').click();
        cy.get("[data-cy=logout-button]").should('exist').click();
        cy.verifyRoute("/login");
    })
}

const routes = ["/people", "/groups"];

// testing user already logged in by checking app routing.
function alreadyLoggedIn() {
    it("Verify already logged in", () => {
        cy.login();

        routes.map(route => {
            cy.visitAndVerify(route)
            return null;
        })
    })
}

function notLoggedIn() {
    it("Verify user not logged in", () => {
        routes.map(route => {
            cy.visit(route);
            cy.verifyRoute("/login");
            return null;
        })
    })
}