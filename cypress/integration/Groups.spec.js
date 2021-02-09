context("Groups", () => {
  before(() => {
    cy.login();
    cleanupGroups();
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/groups");
  });

  createGroup();
  deleteGroup();
  trackAttendanceAndTabs();
  addRemovePersonGroup();
  addPersonToSession();
});

function cleanupGroups() {
  cy.clearPeople();
  cy.clearCampuses();
  cy.clearServices();
  cy.clearServiceTimes();

  // remove groups
  cy.makeApiCall("GET", "/groups", "MembershipApi").then(groups => {
    groups.map(group => { cy.makeAsyncApiCall("DELETE", `/groups/${group.id}`, "MembershipApi") });
  });
}

function createGroup() {
  it("Create group", () => {
    const categoryName = "Testing";
    const groupName = "Cypress";

    cy.get("[data-cy=add-button]").should("exist").click();
    cy.get("[data-cy=save-button]").should("exist");
    cy.enterText("[data-cy=category-name]", categoryName);
    cy.enterText("[data-cy=group-name]", groupName);
    cy.get("[data-cy=save-button]").click();
    cy.containsAll("[data-cy=content]", [categoryName, groupName]);
  });
}

function deleteGroup() {
  it("Delete group", () => {
    const group = {
      categoryName: "To Delete",
      name: "Test Name",
    };

    cy.createGroup(group);
    cy.containsClick(group.name);
    cy.get("h1").should("exist").should("contain", group.name);
    cy.get("[data-cy=edit-button]").should("exist").click();
    cy.get("[data-cy=delete-button]").should("exist").click();

    const values = Object.values(group);
    cy.notContainAll("[data-cy=content]", values);
  });
}

function trackAttendanceAndTabs() {
  it("Enable track attendance and check tabs of a group", () => {
    const group = {
      categoryName: "Attendance",
      name: "Track",
    };

    cy.createGroup(group);
    cy.containsClick(group.name);
    cy.get("h1").should("exist").should("contain", group.name);
    cy.get("[data-cy=edit-button]").should("exist").click();
    cy.get("[data-cy=save-button]").should("exist");
    cy.get("[data-cy=select-attendance-type]").should("exist").select("Yes").should("have.value", "true");
    cy.get("[data-cy=save-button]").click();
    cy.containsAll("[data-cy=group-details-box]", ["Yes"]);
    cy.containsAll("[data-cy=group-tabs]", ["Members", "Sessions", "Trends"]);
  });
}

function addRemovePersonGroup() {
  it("Add/Remove person to/from group", () => {
    const people = [{ first: "Troye", last: "Smith" }];
    const group = {
      categoryName: "Test",
      name: "add/remove person",
    };

    cy.createGroup(group);
    cy.createPeople(people);

    cy.containsClick(group.name);
    cy.get("h1").should("exist").should("contain", group.name);
    cy.enterText("[data-cy=person-search-bar]", people[0].first);
    cy.get("[data-cy=person-search-button]").should("exist").click();
    cy.get("[data-cy=add-to-list]").should("exist").click();
    cy.get(`a:contains('Members')`).should("exist").should("have.class", "active");

    const personFullName = Object.values(people[0]).join(" ")
    cy.containsAll("[data-cy=group-members-tab] > [data-cy=content]", [personFullName]);

    cy.get("[data-cy=remove-member-0]").should("exist").click();
    cy.notContainAll("[data-cy=group-members-tab] > [data-cy=content]", [personFullName]);
  });
}

function addPersonToSession() {
  it("Add Person to session and Check Trends", () => {
    const people = [{ first: "Benny", last: "Beltik" }];
    const group = {
      categoryName: "Interaction",
      name: "Tabs",
    };
    const service = {
      campusName: "Trinity",
      name: "Study",
      time: "7:00"
    }

    createTestData(people, group, service);
    cy.visit("/groups");

    // enable attendance tracking
    cy.containsClick(group.name);
    cy.get("h1").should("exist").should("contain", group.name);
    cy.get("[data-cy=edit-button]").should("exist").click();
    cy.get("[data-cy=save-button]").should("exist");
    cy.get("[data-cy=select-attendance-type]").should("exist").select("Yes").should("have.value", "true");

    // add service to the group
    const fullServiceName = `${service.campusName} - ${service.name} - ${service.time}`;
    cy.containsAll("[data-cy=choose-service-time]", [fullServiceName])
    cy.get("[data-cy=add-service-time]").should("exist").click();
    cy.get("[data-cy=save-button]").click();
    cy.containsAll("[data-cy=group-details-box]", ["Yes", fullServiceName])

    // create a new session
    cy.get("[data-cy=sessions-tab]").should("exist").click();
    cy.get("[data-cy=no-session-msg]").should("exist");
    cy.get("[data-cy=available-group-members]").should("exist");
    cy.get("[data-cy=create-new-session]").should("exist").click();
    cy.containsAll("[data-cy=add-session-box]", [fullServiceName]);
    cy.get("[data-cy=save-button]").should("exist").click();

    // check the newly created session
    cy.get("[data-cy=session-present-msg]").should("exist");
    const fullPersonName = Object.values(people[0]).join(" ");
    cy.containsAll("[data-cy=available-group-members]", [fullPersonName]);
    cy.get("[data-cy=add-member-to-session]").should("exist").click();
    cy.containsAll("[data-cy=group-session-box] > [data-cy=content]", [fullPersonName]);

    // check chart presence
    cy.get("[data-cy=trends-tab]").should("exist").click();
    cy.get("#column-chart-cy").should("exist");
  });
}

function createTestData(people, group, service) {
  cy.createGroup(group).then((groups) => {
    const groupId = groups[0].id;

    cy.createPeople(people).then((people) => {
      const personId = people[0].id;

      cy.getPerson(personId).then((person) => {
        cy.makeApiCall("POST", "/groupmembers", [{ groupId, personId, person }])
      });
    });
  });

  cy.makeApiCall("POST", "/campuses", "AttendanceApi", [{ id: 0, name: service.campusName }]).then((res) => {
    const campusId = res[0].id;

    cy.makeApiCall("POST", "/services", [{ id: 0, campusId, name: service.name }]).then((services) => {
      const serviceId = services[0].id;

      cy.makeApiCall("POST", "/servicetimes", [{ id: 0, serviceId, name: service.time }])
    });
  });
}