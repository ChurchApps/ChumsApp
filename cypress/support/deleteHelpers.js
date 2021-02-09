Cypress.Commands.add("clearPeople", () => {
  cy.makeApiCall("GET", "/people/search?term=", "MembershipApi").then((people) => {
    people.map(p => {
      if (p.name.display !== "Pranav Cypress") cy.makeAsyncApiCall("DELETE", `/people/${p.id}`, "MembershipApi");
    })
  });
})

Cypress.Commands.add("clearCampuses", () => {
  cy.makeApiCall("GET", "/campuses", "AttendanceApi").then(campuses => {
    campuses.map((campus) => { cy.makeAsyncApiCall("DELETE", `/campuses/${campus.id}`, "AttendanceApi") });
  });
})

Cypress.Commands.add("clearServices", () => {
  cy.makeApiCall("GET", "/services", "AttendanceApi").then(services => {
    services.map((service) => { cy.makeAsyncApiCall("DELETE", `/services/${service.id}`, "AttendanceApi") });
  });
})

Cypress.Commands.add("clearServiceTimes", () => {
  cy.makeApiCall("GET", "/servicetimes", "AttendanceApi").then(serviceTimes => {
    serviceTimes.map((st) => { cy.makeAsyncApiCall("DELETE", `/servicetimes/${st.id}`, "AttendanceApi") });
  });
})