context("People", () => {
  before(() => {
    cy.login();
    doCleanUp();
  })

  beforeEach(() => {
    cy.login();
    cy.visit("/people");
  });

  createPerson();
  searchPerson();
  addANote();
  removePerson();
  editPerson();
  changeHouseholdName();
  noAddressChange()
  withAddressChange();
  mergePerson();
  changeAddressOfAllHousehold();
  changeAddressOfOnlyCurrentPerson();
});

function doCleanUp() {
  cy.clearPeople();
}

function createPerson() {
  const firstName = "Harvey";
  const lastName = "Specter"; 

  it("Create Person", () => {
    cy.enterText("[data-cy=firstname]", firstName);
    cy.enterText("[data-cy=lastname]", lastName);
    cy.get("[data-cy=add-person]").should('exist').click();
    cy.containsAll("h2", [ `${firstName} ${lastName}` ]);
  });
}

function searchPerson() {
  const first = "Mike";
  const last = "Ross";
  it("Search Person", () => {
    cy.createPeople([{ first, last }]);
    cy.enterText("[data-cy=search-input]", first);
    cy.get("[data-cy=search-button]").should('exist').click();
    cy.containsClick(`${first} ${last}`);
    cy.containsAll("h2", [ `${first} ${last}` ]);
  })
}

function addANote() {
  const first = "Benny";
  const last = "Beltik";
  const noteText = 'This is a test note'
  it("Add a Note to person", () => {
    cy.createPeople([{ first, last }]);
    cy.containsClick(`${first} ${last}`);
    cy.enterText("[data-cy=enter-note]", noteText);
    cy.get("[data-cy=save-button]").should('exist').click();
    cy.get("[data-cy=enter-note]").should('exist').should("have.value", "");
    cy.containsAll("[data-cy=notes-box]", [ noteText ]);
  });
}

function removePerson() {
  const first = "Bruce";
  const last = "wayne";

  it("Remove person", () => {
    cy.createPeople([{ first, last }]);
    cy.containsClick(`${first} ${last}`);
    cy.containsAll("[data-cy=household-box]", [ `${first} ${last}` ]);
    cy.get("[data-cy=edit-person-button]").should('exist').click();
    cy.get("[data-cy=delete-button]").should('exist').click();
    cy.verifyRoute("/people");
  })
}

function editPerson() {
  const first = "Thomas", last = "Shelby";
  const texts = {
    email: "thomas@chums.org",
    homePhone: "9876543210",
    mobilePhone: "0123456789",
    address1: "123 N",
    address2: "North Main",
    city: "Malibu",
    zip: "543216"
  }
  const options = {
    gender: "Male",
    "member-ship-status": "Visitor",
    state: "CA"
  }

  it("Edit and verify Person", () => {
    cy.createPeople([{ first, last }]);
    cy.containsClick(`${first} ${last}`);
    cy.containsAll("[data-cy=household-box]", [ `${first} ${last}` ]);
    cy.get("[data-cy=edit-person-button]").should('exist').click();

    const textKeys = Object.keys(texts);
    const optionKeys = Object.keys(options);
    textKeys.map(key => {
      cy.enterText(`[data-cy=${key}]`, texts[key]);
    })
    cy.enterText("[data-cy=birthdate]", "1997-01-01")
    optionKeys.map(key => {
      cy.selectOption(`[data-cy=${key}]`, options[key]);
    })
    
    const textValues = Object.values(texts);
    const optionValues = Object.values(options);
    
    cy.get(":nth-child(3) > [data-cy=save-button]").click();
    cy.containsAll("h2", [ `${first} ${last}` ]);
    cy.containsAll("[data-cy=person-details-box]", ["24"]);
    cy.containsAll("[data-cy=person-details-box]", [...textValues, ...optionValues]);
  });
}

function changeHouseholdName() {
  it("Change household name", () => {
    const first = "Beth", last = "Hart", newHouseHoldName = "Harmon";

    cy.createPeople([{ first, last}]);
    cy.containsClick(`${first} ${last}`);
    cy.containsAll("[data-cy=household-box]", [ `${first} ${last}` ]);
    cy.get("[data-cy=edit-button]").should('exist').click();
    cy.enterText("[data-cy=household-name]", newHouseHoldName);
    cy.get(":nth-child(2) > [data-cy=save-button]").should('exist').click();
    cy.containsAll("[data-cy=household-box] > .header", [newHouseHoldName]);
  });  
}

function createTestData(people, contactInfo) {
  cy.createPeople(people).then((people) => {
    people.map((person, index) => {
      const personId = person.id;
     
      cy.getPerson(personId).then(p => {
        const newPerson = {
          ...p,
          contactInfo: {
            ...p.contactInfo,
            ...contactInfo[index]
          }
        }
        cy.makeApiCall("POST", "/people", [newPerson]);
      });      
    })

  });
}

function noAddressChange() {
  const people = [
    { first: "James", last: "Bond" },
    { first: "Hayley", last: "Marshall" }
  ]
  const contactInfo = [
    {
    address1: "123 N",
    address2: "North Main",
    city: "Malibu",
    state: "CA",
    zip: "543216"
    }, 
    {
      address1: "Trinity",
      address2: "UK"
    }
  ]
  it("Add member to household without address change", () => {
    createTestData(people, contactInfo);

    const person1 = people[0], person2 = people[1];

    cy.containsClick(`${person2.first} ${person2.last}`);
    cy.containsAll("[data-cy=household-box]", [ `${person2.first} ${person2.last}` ]);
    cy.get("[data-cy=edit-button]").should('exist').click();
    cy.get(".text-success").should('exist').click();
    cy.enterText("[data-cy=person-search-bar]", person1.first);
    cy.get("[data-cy=person-search-button]").should('exist').click();
    cy.get("[data-cy=add-to-list]").should('exist').click();
    cy.get("[data-cy=no-button]").should('exist').click();
    cy.get(":nth-child(2) > [data-cy=save-button]").should('exist').click();
    cy.containsClick(`${person1.first} ${person1.last}`);

    const infoOfPerson2 = Object.values(contactInfo[1]);
    cy.notContainAll("[data-cy=person-details-box]", infoOfPerson2)
  });
}

function withAddressChange() {
  const people = [
    { first: "Damon", last: "Lake" },
    { first: "Elena", last: "Marshall" }
  ]
  const contactInfo = [
    {
    address1: "123 N",
    address2: "North Main",
    city: "Malibu",
    state: "CA",
    zip: "543216"
    }, 
    {
      address1: "Trinity",
      address2: "UK"
    }
  ]
  it("Add member to household with its address changed", () => {
    createTestData(people, contactInfo);

    const person1 = people[0], person2 = people[1];

    cy.containsClick(`${person1.first} ${person1.last}`);
    cy.containsAll("[data-cy=household-box]", [ `${person1.first} ${person1.last}` ]);
    cy.get("[data-cy=edit-button]").should('exist').click();
    cy.get(".text-success").should('exist').click();
    cy.enterText("[data-cy=person-search-bar]", person2.first);
    cy.get("[data-cy=person-search-button]").should('exist').click();
    cy.get("[data-cy=add-to-list]").should('exist').click();
    cy.get("[data-cy=yes-button]").should('exist').click();
    cy.containsAll("[data-cy=household-box]", [ `${person2.first} ${person2.last}` ]);
    cy.get(":nth-child(2) > [data-cy=save-button]").should('exist').click();
    cy.containsClick(`${person2.first} ${person2.last}`);

    const infoOfPerson1 = Object.values(contactInfo[0]);
    cy.containsAll("[data-cy=person-details-box]", infoOfPerson1)
  });
}


function mergePerson() {
  const people = [
    { first: "Richard", last: "Henricks" },
    { first: "Gilfoyle", last: "smith" }
  ]
  const contactInfo = [
    {
    address1: "123 N",
    address2: "North Main",
    city: "Malibu",
    state: "CA",
    zip: "543216"
    }, 
    {
      address1: "654 six street",
      address2: "opposite maria beach",
      city: "London",
      state: "Scotland",
      zip: "25874"
    }
  ]  
  it("Merge person records", () => {

    createTestData(people, contactInfo)

    const person1 = people[0], person2 = people[1];

    cy.containsClick(`${person1.first} ${person1.last}`);
    cy.containsAll("[data-cy=household-box]", [ `${person1.first} ${person1.last}` ]);
    cy.get("[data-cy=edit-person-button]").should('exist').click();
    cy.get("[data-cy=merge-button]").should('exist').click();
    cy.enterText("[data-cy=search-input]", person2.first);
    cy.get("[data-cy=search-button]").should('exist').click();
    cy.get(".text-success").should('exist').click();
    cy.get("[data-cy=merge-modal]").should('exist').should('be.visible');
    cy.get(".col-sm-10 > :nth-child(2) > .form-check-input").check();
    cy.get("[data-cy=confirm-merge]").should('exist').click();
    cy.containsAll("h1", ["People"]);
    cy.notContainAll("[data-cy=content]", [`${person1.first} ${person1.last}`]);
    cy.containsClick(`${person2.first} ${person2.last}`);

    const contactValues = Object.values(contactInfo[1]);
    const nameValues = Object.values(people[1]);

    cy.containsAll("[data-cy=person-details-box]", [...contactValues, ...nameValues]);
  });
}

function createTestDataWithMembers(peopleToCreate, contactInfo) {
  cy.createPeople(peopleToCreate).then(() => {
    cy.makeApiCall("GET", "/people/search?term=").then(people => {
      let members = [];
      const [person1, person2] = peopleToCreate;
      people.map(p => {
        if (p.name.display === `${person1.first} ${person1.last}` || p.name.display === `${person2.first} ${person2.last}`) {
          members.push(p);
        }
      })
      const updatehouseHoldMembers = members.map((m, index) => {
        return {
            ...m,
            householdId: members[0].householdId,
            contactInfo: {
              ...m.contactInfo,
              ...contactInfo[index]
            }
        }
      })
      cy.makeApiCall("POST", "/people", updatehouseHoldMembers);
      cy.makeApiCall("POST", `/people/household/${members[0].householdId}`, updatehouseHoldMembers);
    })

  });
}

function changeAddressOfAllHousehold() {
  const people = [
    { first: "Richard", last: "Henricks" },
    { first: "Gavin", last: "Belson" }
  ]
  const contactInfo = [
    {
    address1: "123 N",
    address2: "North Main",
    city: "Malibu",
    state: "CA",
    zip: "543216"
    }, 
    {
      address1: "654 six street",
      address2: "opposite maria beach",
      city: "London",
      state: "Scotland",
      zip: "25874"
    }
  ]

  const newAddress1 = "114 PT";
  const newAddress2 = "Saint louis";

  it("Change Address of all household members on changing address of one member", () => {
    createTestDataWithMembers(people, contactInfo);
    const person1 = people[0], person2 = people[1];

    cy.containsClick(`${person1.first} ${person1.last}`);
    cy.containsAll("[data-cy=household-box]", [ `${person1.first} ${person1.last}` ]);
    cy.get("[data-cy=edit-person-button]").should('exist').click();
    cy.enterText("[data-cy=address1]", newAddress1);
    cy.enterText("[data-cy=address2]", newAddress2);
    cy.get(":nth-child(3) > [data-cy=save-button]").should('exist').click();
    cy.get("[data-cy=yes-button]").should('exist').click();
    cy.containsAll("h2", [`${person1.first} ${person1.last}`]);

    // verify change
    cy.containsAll("[data-cy=person-details-box]", [newAddress1, newAddress2]);
    cy.containsClick(`${person2.first} ${person2.last}`);
    cy.containsAll("[data-cy=person-details-box]", [newAddress1, newAddress2]);
  })
}

function changeAddressOfOnlyCurrentPerson() {
  const people = [
    { first: "Hank", last: "Moody" },
    { first: "Troye", last: "sivan" }
  ]
  const contactInfo = [
    {
    address1: "123 N",
    address2: "North Main",
    city: "Malibu",
    state: "CA",
    zip: "543216"
    }, 
    {
      address1: "654 six street",
      address2: "opposite maria beach",
      city: "London",
      state: "Scotland",
      zip: "25874"
    }
  ]

  const newAddress1 = "666 street";
  const newAddress2 = "Besides shot cinema";

  it("Verify change in address causes change in address only for that person", () => {
    createTestDataWithMembers(people, contactInfo);
    const person1 = people[0], person2 = people[1];

    cy.containsClick(`${person1.first} ${person1.last}`);
    cy.containsAll("[data-cy=household-box]", [ `${person1.first} ${person1.last}` ]);
    cy.get("[data-cy=edit-person-button]").should('exist').click();
    cy.enterText("[data-cy=address1]", newAddress1);
    cy.enterText("[data-cy=address2]", newAddress2);
    cy.get(":nth-child(3) > [data-cy=save-button]").should('exist').click();
    cy.get("[data-cy=no-button]").should('exist').click();
    cy.containsAll("h2", [`${person1.first} ${person1.last}`]);

    // verify
    cy.containsAll("[data-cy=person-details-box]", [newAddress1, newAddress2]);
    cy.containsClick(`${person2.first} ${person2.last}`);
    cy.notContainAll("[data-cy=person-details-box]", [newAddress1, newAddress2]);
  })
}
