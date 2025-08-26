export const SELECTORS = {
  // Login page
  login: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    errorMessage: '[role="alert"]:has-text("Invalid login")',
  },

  // Navigation
  nav: {
    menuButton: '[aria-label="Menu"]',
    dashboardDropdown: 'button:has-text("Dashboard")',
    peopleLink: 'a[href="/people"]',
    groupsLink: 'a[href="/groups"]',
    donationsLink: 'a[href="/donations"]',
    formsLink: 'a[href="/forms"]',
    plansLink: 'a[href="/plans"]',
    attendanceLink: 'a[href="/attendance"]',
    tasksLink: 'a[href="/tasks"]',
    settingsLink: 'a[href="/settings"]',
  },
  
  // Dashboard elements
  dashboard: {
    header: 'h1:has-text("Chums Dashboard")',
    peopleSection: 'h2:has-text("People")',
    peopleSearchInput: 'input[placeholder*="Search"]',
    tasksSection: 'h2:has-text("Tasks")',
    addTaskButton: 'button:has-text("Add Task")',
    groupCards: '[data-testid="group-card"]',
  },

  // People module
  people: {
    pageHeader: 'h1',
    addButton: 'button:has-text("Add")',
    searchInput: 'input[placeholder*="search"]',
    searchButton: 'button:has-text("Search")',
    resultsTable: 'table',
    personRow: 'tbody tr',
    editButton: 'button:has-text("Edit")',
    deleteButton: 'button:has-text("Delete")',
    
    form: {
      modal: '[role="dialog"]',
      firstNameInput: 'input[name="firstName"]',
      lastNameInput: 'input[name="lastName"]',
      emailInput: 'input[name="email"]',
      phoneInput: 'input[name="phone"]',
      saveButton: 'button:has-text("Save")',
      cancelButton: 'button:has-text("Cancel")',
    },
  },

  // Common UI elements
  common: {
    pageHeader: 'h1',
    loadingSpinner: '[role="progressbar"]',
    notification: '[role="alert"]',
    modal: '[role="dialog"]',
    confirmButton: 'button:has-text("Confirm")',
    cancelButton: 'button:has-text("Cancel")',
  },
} as const;