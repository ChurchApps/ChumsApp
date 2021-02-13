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

Cypress.Commands.add("clearForms", () => {
  cy.makeApiCall("GET", "/forms", "MembershipApi").then(forms => {
    forms.map((f) => { cy.makeAsyncApiCall("DELETE", `/forms/${f.id}`, "MembershipApi") });
  })
})

Cypress.Commands.add("clearQuestions", () => {
  cy.makeApiCall("GET", "/questions", "MembershipApi").then(questions => {
    questions.map(q => { cy.makeAsyncApiCall("DELETE", `/questions/${q.id}`, "MembershipApi") }); 
  })
})