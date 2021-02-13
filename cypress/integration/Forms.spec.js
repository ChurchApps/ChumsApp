context('Forms', () => {
    before(() => {
        cy.login();
        cleanupForms();
    })

    beforeEach(() => {
        cy.login();
        cy.visit('/forms');
    })

    createForm();
    editForm();
    deleteForm();
    addQuestions();
    editQuestion();
    deleteQuestion();
    reorderQuestions();
});

function cleanupForms() {
    cy.clearQuestions();
    cy.clearForms();
}

function createForm() {
    it('Create Form', () => {
        const formName = 'Registration'

        cy.get("[data-cy=add-button]").should('exist').click();
        cy.enterText("[data-cy=form-name]", formName);
        cy.get("[data-cy=save-button]").should('exist').click();
        cy.containsAll("[data-cy=content]", [formName]);
    })
}

function editForm() {
    it("Edit Form", () => {
        const forms = [{contentType: 'person', name: "Edit-Me"}];
        const newFormName = "Edited";

        cy.createForms(forms)
        cy.visit("/forms");
        cy.get(`[data-cy=edit-${forms[0].name}]`).should('exist').click();
        cy.enterText("[data-cy=form-name]", newFormName);
        cy.get("[data-cy=save-button]").should('exist').click();
        cy.containsAll("[data-cy=content]", [newFormName]);
    })
}

function deleteForm() {
    it("Delete Form", () => {
        const forms = [{contentType: "person", name: "Delete-me"}];

        cy.createForms(forms);
        cy.visit("/forms");
        cy.get(`[data-cy=edit-${forms[0].name}]`).should('exist').click();
        cy.get("[data-cy=delete-button]").should("exist").click();
        cy.visit("/forms");
        cy.notContainAll("[data-cy=content]", [forms[0].name]);
    })
}

function addQuestions() {
    it("Add all types of questions", () => {
        const forms = [{contentType: "person", name: "Checkout"}]
        const questions = [
            { title: "Full Name", description: "This is some description", placeholder: "Anthony smiths" },
            { title: "Payment Type", fieldType: "Multiple Choice", choices: ["Card", "Cash"] }
        ]
        const questionTitles = questions.map(q => q.title);

        cy.createForms(forms);
        cy.visit("/forms");
        cy.containsClick(forms[0].name);
        // textbox question
        cy.get("[data-cy=edit-question-button]").should('exist').click();
        cy.enterText("[data-cy=title]", questions[0].title);
        cy.enterText("[data-cy=description]", questions[0].description);
        cy.enterText("[data-cy=placeholder]", questions[0].placeholder);
        cy.get("[data-cy=save-button]").should('exist').click();
        cy.containsAll("[data-cy=content]", [questions[0].title])

        // multiple choice question
        cy.get("[data-cy=edit-question-button]").should('exist').click();
        cy.selectOption("[data-cy=type]", questions[1].fieldType);
        cy.enterText("[data-cy=title]", questions[1].title);

        questions[1].choices.map(choice => {
            cy.enterText("[data-cy=value]", choice);
            cy.enterText("[data-cy=text]", choice);
            cy.get("[data-cy=add-button]").should('exist').click();
        })
        cy.get("[data-cy=save-button]").should('exist').click();
        cy.containsAll("[data-cy=content]", questionTitles);
    })
}

function editQuestion() {
    it("Edit question", () => {
        const form = {contentType: "person", name: "Usual"};
        const questions = [{ fieldType: "Textbox", title: "FirstName", description: "Enter your name", placeholder: "Johnny" }];
        const updatedQuestion = { title: "First Name", description: "Your legal name", placeholder: "John" };

        createFormWithQuestions(form, questions);
        cy.visit("/forms");
        cy.containsClick(form.name);
        cy.containsClick(questions[0].title);
        cy.enterText("[data-cy=title]", updatedQuestion.title);
        cy.enterText("[data-cy=description]", updatedQuestion.description);
        cy.enterText("[data-cy=placeholder]", updatedQuestion.placeholder);
        cy.get("[data-cy=save-button]").should('exist').click();
        cy.notContainAll("[data-cy=content]", [questions[0].title]);
        cy.containsAll("[data-cy=content]", [updatedQuestion.title]);
    })
}

function deleteQuestion() {
    it("Delete question", () => {
        const form = {contentType: "person", name: "Signup"};
        const questions = [{ fieldType: "Textbox", title: "Username", description: "A unique handle", placeholder: "gabnorth97" }];

        createFormWithQuestions(form, questions);
        cy.visit("/forms");
        cy.containsClick(form.name);
        cy.containsClick(questions[0].title);
        cy.get("[data-cy=delete-button]").should('exist').click();
        cy.notContainAll("[data-cy=content]", [questions[0].title]);
    })
}

function reorderQuestions() {
    it('Re-order questions', () => {
        const forms = {contentType: "person", name: "Reorder"}
        const questions = [
            { fieldType: "Textbox", title: "FirstName" },
            { fieldType: "Textbox", title: "LastName" }
        ]

        createFormWithQuestions(forms, questions);
        cy.visit("/forms");
        cy.containsClick(forms.name);
        cy.get("tbody tr:first").should('contain', questions[0].title);
        cy.get("tbody tr:first .fa-arrow-down").should('exist').click();
        cy.get("tbody tr:last").should("contain", questions[0].title);
        cy.get("tbody tr:last .fa-arrow-up").should('exist').click();
    })
}

function createFormWithQuestions(form, questions) {
    cy.createForms([form]).then(result => {
        const formId = result[0].id;

        questions.forEach(q => {
            q.formId = formId;
        })
        cy.makeApiCall("POST", "/questions", "MembershipApi", questions);
    })
}
