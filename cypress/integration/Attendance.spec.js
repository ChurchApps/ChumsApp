context("Attendance", () => {
  before(() => {
    cy.login();
    cleanupAttendance();
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/attendance");
  });

  verifyGroupsAttendance();
  addEditCampus();
  addEditService();
  addEditServiceTime();
});

function cleanupAttendance() {
  cy.clearPeople();
  cy.clearCampuses();
  cy.clearServices();
  cy.clearServiceTimes();

  // remove groups & its related sessions
  cy.makeApiCall("GET", "/groups").then(groups => {
    groups.map((group) => { removeGroupAndItsSessions(group) })
  });
}

function createTestData(campusServiceTime, groups, people) {
  var promises = [];
  campusServiceTime.map(service => {
    promises.push(new Cypress.Promise(() => { createCompleteService(service); }));
  });
  cy.wrap(null).then(() => { return Promise.all(promises) });

  cy.createPeople(people);

  promises = [];
  groups.map((group, index) => { createTestGroup(group, people[index], index); });
}

function createTestGroup(group, personToAdd, index) {
  cy.makeApiCall("POST", "/groups", [group]).then((data) => {
    const groupId = data[0].id;

    cy.makeApiCall("GET", "/servicetimes").then((servicesTimes) => {
      const serviceTimeId = servicesTimes[index].id;

      cy.makeApiCall("POST", "/groupservicetimes", [{ groupId: groupId, serviceTimeId: serviceTimeId, }]);
      cy.makeApiCall("GET", `/groups/${groupId}`).then((group) => {
        const updatedGroup = { ...group, trackAttendance: true, };

        cy.makeApiCall("POST", "/groups", [updatedGroup]);
        createSessionAndAddPerson(groupId, personToAdd);
      });
    });
  });
}


function addEditCampus() {
  it("Add / Edit Campus", () => {
    const BEFORE_CAMPUS_NAME = "Moon";
    const AFTER_CAMPUS_NAME = "Dark Side of Moon";

    cy.get("[data-cy=add-button]").should("exist").click();
    cy.get("[data-cy=add-campus]").should("exist").click();
    cy.get("[data-cy=campus-box]").should("exist");
    cy.enterText("[data-cy=campus-name]", BEFORE_CAMPUS_NAME)
    cy.get(":nth-child(3) > [data-cy=save-button]").should("exist").click();
    cy.containsAll("[data-cy=attendance-groups] > [data-cy=content]", [BEFORE_CAMPUS_NAME])
    cy.containsClick(BEFORE_CAMPUS_NAME);
    cy.enterText("[data-cy=campus-name]", AFTER_CAMPUS_NAME)
    cy.get(":nth-child(3) > [data-cy=save-button]").should("exist").click();
    cy.containsAll("[data-cy=attendance-groups] > [data-cy=content]", [AFTER_CAMPUS_NAME])
  });
}

function verifyGroupsAttendance() {
  it("Verify Trends & group attendance", () => {
    const campusServiceTime = [
      { campus_name: "chart", service_name: "attendance", service_time: "9:00", },
      { campus_name: "pal", service_name: "workshop", service_time: "5:00", },
    ];

    const groups = [
      { categoryName: "Learning", name: "Palo", },
      { categoryName: "Planetry", name: "Mars", },
    ];

    const people = [
      { first: "Benny", last: "Watts" },
      { first: "Ana", last: "smiths" },
    ];

    createTestData(campusServiceTime, groups, people);
    cy.wait(3000);
    cy.visit("/attendance");
    cy.wait(3000);

    // Start Group Attendance tests
    cy.get("[data-cy=group-tab]").should("exist").click();
    // TODO: set data to current date before testing the new line (its buggy right now, when tests are run on sundays - due to time difference, my browser is already in a different week (maybe its the cause))
    // cy.get("[data-cy=select-date]").should('exist').type("2021-01-10");
    // cy.get("[data-cy=save-button]").should('exist').click();

    // const serviceTimes = campusServiceTime.map(c => c.service_time);
    // cy.containsAll("[data-cy=chartBox-groupAttendance] > [data-cy=content]", serviceTimes);

    // // Filter data against services
    // cy.get("[data-cy=select-service]").should("exist").select(campusServiceTime[0].service_name);
    // cy.get("[data-cy=save-button]").should("exist").click();
    // cy.get("[data-cy=chartBox-groupAttendance] > [data-cy=content]").should("exist")
    // .should("contain", campusServiceTime[0].service_time)
    // .and("not.contain", campusServiceTime[1].service_time);

    // cy.get("[data-cy=select-service]").should("exist").select(campusServiceTime[1].service_name);
    // cy.get("[data-cy=save-button]").should("exist").click();
    // cy.get("[data-cy=chartBox-groupAttendance] > [data-cy=content]").should("exist")
    //   .should("contain", campusServiceTime[1].service_time)
    //   .and("not.contain", campusServiceTime[0].service_time);

    cy.wait(3000);

    // Start Trends tests
    cy.get("[data-cy=trends-tab]").should("exist").click();
    // cy.get('[x="0"]').should("exist");
    // apply & test filters
    [0, 1].map((e, index) => {
      const selection = {
        'select-campus': campusServiceTime[index].campus_name,
        'select-service': campusServiceTime[index].service_name,
        'select-service-time': `${campusServiceTime[index].campus_name} - ${campusServiceTime[index].service_name} - ${campusServiceTime[index].service_time}`,
        'select-category': groups[index].categoryName,
        'select-group': groups[index].name
      }

      const keys = Object.keys(selection);
      keys.map(key => {
        cy.get(`[data-cy=${key}]`)
          .should("exist")
          .select(selection[key]);
      })

      cy.get("[data-cy=save-button]").should("exist").click();

      const campusValues = Object.values(campusServiceTime[index]);
      const groupValues = Object.values(groups[index])

      cy.containsAll("[data-cy=filter-box]", [...campusValues, ...groupValues])
    });
  });
}

function addEditService() {
  it("Add / Edit Service", () => {
    const CAMPUS_NAME = "siruis";
    const BEFORE_SERVICE_NAME = "Inter Galactic";
    const AFTER_SERVICE_NAME = "Inter Solar";

    cy.makeApiCall("POST", "/campuses", [{ id: 0, name: CAMPUS_NAME }]);

    cy.containsAll("[data-cy=attendance-groups] > [data-cy=content]", [CAMPUS_NAME])
    cy.get("[data-cy=add-button]").should("exist").click();
    cy.get("[data-cy=add-service]").should("exist").click();
    cy.wait(3000);
    cy.get("[data-cy=service-box] > .content > :nth-child(1) > [data-cy=select-campus]")
      .should("exist")
      .select(CAMPUS_NAME);
    cy.enterText("[data-cy=service-name]", BEFORE_SERVICE_NAME);
    cy.get(":nth-child(3) > [data-cy=save-button]").should("exist").click();
    cy.containsAll("[data-cy=attendance-groups] > [data-cy=content]", [CAMPUS_NAME, BEFORE_SERVICE_NAME]);
    cy.containsClick(BEFORE_SERVICE_NAME);
    cy.wait(3000);
    cy.get("[data-cy=service-box]").should("exist");
    cy.enterText("[data-cy=service-name]", AFTER_SERVICE_NAME);
    cy.get(":nth-child(3) > [data-cy=save-button]").should("exist").click();
    cy.containsAll("[data-cy=attendance-groups] > [data-cy=content]", [AFTER_SERVICE_NAME]);
  });
}

function addEditServiceTime() {
  it("Add / Edit Service Time", () => {
    const CAMPUS_NAME = "Mars";
    const SERVICE_NAME = "mid-2020s";
    const BEFORE_SERVICE_TIME = "11:00";
    const AFTER_SERVICE_TIME = "7:00";

    cy.makeApiCall("POST", "/campuses", [{ id: 0, name: CAMPUS_NAME }]).then(res => {
      const campus = res[0];
      cy.makeApiCall("POST", "/services", [{ id: 0, campusId: campus.id, name: SERVICE_NAME }]);
    });

    cy.visit("/attendance");
    cy.containsAll("[data-cy=attendance-groups] > [data-cy=content]", [CAMPUS_NAME, SERVICE_NAME])
    cy.get("[data-cy=add-button]").should("exist").click();
    cy.get("[data-cy=add-service-time]").should("exist").click();
    cy.wait(3000);
    cy.enterText("[data-cy=service-time]", BEFORE_SERVICE_TIME);
    cy.get(":nth-child(3) > [data-cy=save-button]").should("exist").click();
    cy.containsAll("[data-cy=attendance-groups] > [data-cy=content]", [BEFORE_SERVICE_TIME])
    cy.containsClick(BEFORE_SERVICE_TIME);
    cy.wait(3000);
    cy.enterText("[data-cy=service-time]", AFTER_SERVICE_TIME);
    cy.get(":nth-child(3) > [data-cy=save-button]").should("exist").click();
    cy.containsAll("[data-cy=attendance-groups] > [data-cy=content]", [AFTER_SERVICE_TIME]);
  });
}


function createCompleteService({ campus_name, service_name, service_time }) {
  cy.makeApiCall("POST", "/campuses", [{ id: 0, name: campus_name }]).then((res) => {
    const campus = res[0];
    cy.makeApiCall("POST", "/services", [{ id: 0, campusId: campus.id, name: service_name }]).then((services) => {
      const service = services[0];
      cy.makeApiCall("POST", "/servicetimes", [{ id: 0, serviceId: service.id, name: service_time }]);
    });
  });
}

function createSessionAndAddPerson(groupId, personToAdd) {
  cy.makeApiCall("GET", `/groupservicetimes?groupId=${groupId}`).then((gsts) => {
    const serviceTimeId = gsts[0].serviceTimeId;

    cy.makeApiCall("POST", `/sessions`, [{ groupId, serviceTimeId, sessionDate: new Date() }]).then((sessions) => {
      const sessionsId = sessions[0].id;

      cy.makeApiCall("GET", "/people/search?term=").then((people) => {
        people.map((person) => {
          if (person.name.first === personToAdd.first) {
            cy.makeApiCall("POST", "/visitsessions/log", { checkinTime: new Date(), personId: person.id, visitSessions: [{ sessionId: sessionsId }] });
          }
        });
      });
    });
  });
}

function removeGroupAndItsSessions(group) {
  // TODO: resolve the problem and enable deleting session so that graph is not displayed in begining.
  // cy.makeApiCall("GET", `/sessions?groupId=${group.id}`).then((sessions) => {
  //   const sessionsId = sessions[0].id;

  //   cy.makeApiCall("GET", `/visitsessions?sessionId=${sessionsId}`).then(
  //     (vs) => {
  //       console.log("vs", vs);
  //       const personId = vs[0] && vs[0].visit.personId;
  //       cy.makeApiCall(
  //         "DELETE",
  //         `/visitsessions?sessionId=${sessionsId}&personId=${personId}`
  //       );
  //     }
  //   );
  // });
  cy.makeAsyncApiCall("DELETE", `/groups/${group.id}`);
}
