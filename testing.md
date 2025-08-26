# CHUMS Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for CHUMS (CHUrch Management Software). The approach prioritizes maintainability, simplicity, and reusability while ensuring comprehensive test coverage of all application features.

## Core Principles

1. **No Code Duplication**: All shared functionality is abstracted into reusable utilities
2. **Single Source of Truth**: All selectors are centralized in one location
3. **UI Change Resilience**: Tests are decoupled from implementation details
4. **Simple and Maintainable**: Clear, readable tests that anyone can understand and modify
5. **Natural User Flow**: Tests follow the actual user journey through the application

## Architecture

### Folder Structure

```
tests/
├── auth/                      # Authentication setup
│   └── auth.setup.ts         # Global authentication state
├── fixtures/                  # Test fixtures and data
│   ├── test-base.ts         # Extended test base with custom fixtures
│   └── test-data.ts         # Centralized test data
├── pages/                    # Page Object Model classes
│   ├── base.page.ts         # Base page class with common methods
│   ├── login.page.ts        # Login page object
│   ├── people.page.ts       # People module page object
│   ├── groups.page.ts       # Groups module page object
│   ├── donations.page.ts    # Donations module page object
│   ├── forms.page.ts        # Forms module page object
│   ├── plans.page.ts        # Plans module page object
│   ├── attendance.page.ts   # Attendance module page object
│   ├── tasks.page.ts        # Tasks module page object
│   └── settings.page.ts     # Settings page object
├── selectors/                # Centralized selectors
│   └── index.ts             # All application selectors
├── utils/                    # Utility functions
│   ├── navigation.ts        # Navigation helpers
│   ├── waits.ts            # Smart wait utilities
│   ├── validation.ts       # Common validation functions
│   └── api-helpers.ts      # API interaction utilities
├── flows/                   # Reusable user flows
│   ├── person-flow.ts      # Person creation/edit flows
│   ├── group-flow.ts       # Group management flows
│   ├── donation-flow.ts    # Donation processing flows
│   └── attendance-flow.ts  # Attendance tracking flows
├── specs/                   # Test specifications
│   ├── smoke/              # Critical path smoke tests
│   │   ├── login.spec.ts
│   │   └── navigation.spec.ts
│   ├── people/             # People module tests
│   │   ├── member-management.spec.ts
│   │   ├── visitor-tracking.spec.ts
│   │   └── search.spec.ts
│   ├── groups/             # Groups module tests
│   │   ├── group-creation.spec.ts
│   │   ├── session-management.spec.ts
│   │   └── member-assignment.spec.ts
│   ├── donations/          # Donations module tests
│   │   ├── batch-entry.spec.ts
│   │   ├── individual-donations.spec.ts
│   │   └── reporting.spec.ts
│   ├── forms/              # Forms module tests
│   │   ├── form-creation.spec.ts
│   │   └── submission-handling.spec.ts
│   ├── plans/              # Plans module tests
│   │   ├── service-planning.spec.ts
│   │   └── scheduling.spec.ts
│   ├── attendance/         # Attendance module tests
│   │   ├── checkin.spec.ts
│   │   └── reporting.spec.ts
│   ├── tasks/              # Tasks module tests
│   │   ├── automation.spec.ts
│   │   └── task-management.spec.ts
│   └── settings/           # Settings module tests
│       ├── church-settings.spec.ts
│       └── user-management.spec.ts
└── playwright.config.ts     # Playwright configuration
```

## Authentication Strategy

### Global Authentication State

```typescript
// tests/auth/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import { SELECTORS } from '../selectors';
import { TEST_DATA } from '../fixtures/test-data';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Go to the login page
  await page.goto('/');
  
  // Perform login
  await page.fill(SELECTORS.login.emailInput, TEST_DATA.auth.email);
  await page.fill(SELECTORS.login.passwordInput, TEST_DATA.auth.password);
  await page.click(SELECTORS.login.submitButton);
  
  // Wait for authentication to complete
  await page.waitForURL(/\/dashboard/);
  
  // Save storage state
  await page.context().storageState({ path: authFile });
});
```

### Configuration

```typescript
// playwright.config.ts (authentication section)
export default defineConfig({
  projects: [
    // Setup project that runs before all tests
    { 
      name: 'setup', 
      testMatch: /.*\.setup\.ts/ 
    },
    
    // Main test project
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use saved auth state
        storageState: 'tests/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

## Selector Management

### Centralized Selectors

```typescript
// tests/selectors/index.ts
export const SELECTORS = {
  // Navigation
  nav: {
    menuButton: '[data-testid="menu-button"]',
    peopleLink: '[data-testid="nav-people"]',
    groupsLink: '[data-testid="nav-groups"]',
    donationsLink: '[data-testid="nav-donations"]',
    formsLink: '[data-testid="nav-forms"]',
    plansLink: '[data-testid="nav-plans"]',
    attendanceLink: '[data-testid="nav-attendance"]',
    tasksLink: '[data-testid="nav-tasks"]',
    settingsLink: '[data-testid="nav-settings"]',
  },
  
  // Login page
  login: {
    emailInput: '[data-testid="login-email"]',
    passwordInput: '[data-testid="login-password"]',
    submitButton: '[data-testid="login-submit"]',
    errorMessage: '[data-testid="login-error"]',
  },
  
  // People module
  people: {
    addButton: '[data-testid="people-add-button"]',
    searchInput: '[data-testid="people-search-input"]',
    searchButton: '[data-testid="people-search-button"]',
    resultsTable: '[data-testid="people-results-table"]',
    personRow: '[data-testid^="person-row-"]',
    editButton: '[data-testid="person-edit-button"]',
    deleteButton: '[data-testid="person-delete-button"]',
    
    // Person form
    form: {
      firstNameInput: '[data-testid="person-firstname"]',
      lastNameInput: '[data-testid="person-lastname"]',
      emailInput: '[data-testid="person-email"]',
      phoneInput: '[data-testid="person-phone"]',
      membershipSelect: '[data-testid="person-membership"]',
      saveButton: '[data-testid="person-save"]',
      cancelButton: '[data-testid="person-cancel"]',
    },
  },
  
  // Groups module
  groups: {
    addButton: '[data-testid="group-add-button"]',
    groupCard: '[data-testid^="group-card-"]',
    sessionTab: '[data-testid="group-sessions-tab"]',
    membersTab: '[data-testid="group-members-tab"]',
    
    form: {
      nameInput: '[data-testid="group-name"]',
      categorySelect: '[data-testid="group-category"]',
      saveButton: '[data-testid="group-save"]',
    },
  },
  
  // Common UI elements
  common: {
    pageHeader: '[data-testid="page-header"]',
    loadingSpinner: '[data-testid="loading-spinner"]',
    confirmDialog: '[data-testid="confirm-dialog"]',
    confirmButton: '[data-testid="confirm-button"]',
    cancelButton: '[data-testid="cancel-button"]',
    notification: '[data-testid="notification"]',
    errorMessage: '[data-testid="error-message"]',
  },
} as const;
```

### Selector Guidelines

1. **Always use data-testid attributes** for test selectors
2. **Never use CSS classes or implementation details** as selectors
3. **Use hierarchical organization** matching the application structure
4. **Prefix dynamic IDs** with a consistent pattern (e.g., `person-row-${id}`)
5. **Document selector patterns** for dynamic elements

## Page Object Model

### Base Page Class

```typescript
// tests/pages/base.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS } from '../selectors';

export class BasePage {
  constructor(public readonly page: Page) {}
  
  // Common navigation methods
  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }
  
  async clickNavLink(selector: string) {
    await this.page.click(selector);
    await this.waitForPageLoad();
  }
  
  // Wait utilities
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500); // Small buffer for dynamic content
  }
  
  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }
  
  // Common validations
  async verifyPageHeader(title: string) {
    const header = this.page.locator(SELECTORS.common.pageHeader);
    await expect(header).toContainText(title);
  }
  
  // Error handling
  async checkForErrors() {
    const errors = await this.page.locator(SELECTORS.common.errorMessage).count();
    if (errors > 0) {
      const errorText = await this.page.locator(SELECTORS.common.errorMessage).textContent();
      throw new Error(`Page error: ${errorText}`);
    }
  }
}
```

### Feature Page Example

```typescript
// tests/pages/people.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../selectors';

export class PeoplePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async goto() {
    await this.clickNavLink(SELECTORS.nav.peopleLink);
    await this.verifyPageHeader('People');
  }
  
  async searchPerson(searchTerm: string) {
    await this.page.fill(SELECTORS.people.searchInput, searchTerm);
    await this.page.click(SELECTORS.people.searchButton);
    await this.waitForElement(SELECTORS.people.resultsTable);
  }
  
  async addPerson(personData: PersonData) {
    await this.page.click(SELECTORS.people.addButton);
    await this.fillPersonForm(personData);
    await this.page.click(SELECTORS.people.form.saveButton);
    await this.waitForPageLoad();
  }
  
  private async fillPersonForm(data: PersonData) {
    await this.page.fill(SELECTORS.people.form.firstNameInput, data.firstName);
    await this.page.fill(SELECTORS.people.form.lastNameInput, data.lastName);
    if (data.email) {
      await this.page.fill(SELECTORS.people.form.emailInput, data.email);
    }
    if (data.phone) {
      await this.page.fill(SELECTORS.people.form.phoneInput, data.phone);
    }
    if (data.membership) {
      await this.page.selectOption(SELECTORS.people.form.membershipSelect, data.membership);
    }
  }
  
  async verifyPersonExists(firstName: string, lastName: string) {
    const fullName = `${firstName} ${lastName}`;
    const personRow = this.page.locator(SELECTORS.people.personRow).filter({ hasText: fullName });
    await expect(personRow).toBeVisible();
  }
  
  async editPerson(personId: string, updates: Partial<PersonData>) {
    const row = this.page.locator(`[data-testid="person-row-${personId}"]`);
    await row.locator(SELECTORS.people.editButton).click();
    await this.fillPersonForm(updates);
    await this.page.click(SELECTORS.people.form.saveButton);
    await this.waitForPageLoad();
  }
}

interface PersonData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  membership?: 'Member' | 'Visitor' | 'Staff';
}
```

## Reusable Flows

### Flow Example

```typescript
// tests/flows/person-flow.ts
import { Page } from '@playwright/test';
import { PeoplePage } from '../pages/people.page';
import { TEST_DATA } from '../fixtures/test-data';

export class PersonFlow {
  private peoplePage: PeoplePage;
  
  constructor(private page: Page) {
    this.peoplePage = new PeoplePage(page);
  }
  
  async createTestMember() {
    const member = TEST_DATA.people.testMember;
    await this.peoplePage.goto();
    await this.peoplePage.addPerson(member);
    await this.peoplePage.verifyPersonExists(member.firstName, member.lastName);
    return member;
  }
  
  async createTestVisitor() {
    const visitor = TEST_DATA.people.testVisitor;
    await this.peoplePage.goto();
    await this.peoplePage.addPerson(visitor);
    await this.peoplePage.verifyPersonExists(visitor.firstName, visitor.lastName);
    return visitor;
  }
  
  async createMultipleMembers(count: number) {
    const members = [];
    await this.peoplePage.goto();
    
    for (let i = 0; i < count; i++) {
      const member = {
        ...TEST_DATA.people.testMember,
        firstName: `Test${i}`,
        lastName: `Member${i}`,
        email: `test${i}@example.com`,
      };
      await this.peoplePage.addPerson(member);
      members.push(member);
    }
    
    return members;
  }
}
```

## Test Data Management

### Centralized Test Data

```typescript
// tests/fixtures/test-data.ts
export const TEST_DATA = {
  auth: {
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'testpassword',
  },
  
  people: {
    testMember: {
      firstName: 'John',
      lastName: 'TestMember',
      email: 'john.test@example.com',
      phone: '(555) 123-4567',
      membership: 'Member' as const,
    },
    testVisitor: {
      firstName: 'Jane',
      lastName: 'TestVisitor',
      email: 'jane.test@example.com',
      phone: '(555) 987-6543',
      membership: 'Visitor' as const,
    },
  },
  
  groups: {
    testGroup: {
      name: 'Test Small Group',
      category: 'Small Groups',
      meetingDay: 'Wednesday',
      meetingTime: '7:00 PM',
    },
  },
  
  donations: {
    testDonation: {
      amount: 100.00,
      fund: 'General Fund',
      method: 'Check',
      checkNumber: '1234',
    },
  },
} as const;
```

## Test Specifications

### Test Structure Example

```typescript
// tests/specs/people/member-management.spec.ts
import { test, expect } from '../fixtures/test-base';
import { PeoplePage } from '../../pages/people.page';
import { PersonFlow } from '../../flows/person-flow';
import { TEST_DATA } from '../../fixtures/test-data';

test.describe('Member Management', () => {
  let peoplePage: PeoplePage;
  let personFlow: PersonFlow;
  
  test.beforeEach(async ({ page }) => {
    peoplePage = new PeoplePage(page);
    personFlow = new PersonFlow(page);
  });
  
  test('should add a new member', async ({ page }) => {
    // Arrange
    const memberData = TEST_DATA.people.testMember;
    
    // Act
    await peoplePage.goto();
    await peoplePage.addPerson(memberData);
    
    // Assert
    await peoplePage.verifyPersonExists(memberData.firstName, memberData.lastName);
  });
  
  test('should edit member information', async ({ page }) => {
    // Arrange - Create a member first
    const member = await personFlow.createTestMember();
    
    // Act - Edit the member
    const updates = { phone: '(555) 999-8888' };
    await peoplePage.editPerson(member.id, updates);
    
    // Assert
    await peoplePage.searchPerson(member.lastName);
    const updatedPhone = await page.locator(`text=${updates.phone}`).isVisible();
    expect(updatedPhone).toBeTruthy();
  });
  
  test('should search for members', async ({ page }) => {
    // Arrange - Create multiple members
    const members = await personFlow.createMultipleMembers(3);
    
    // Act
    await peoplePage.searchPerson('Test');
    
    // Assert
    for (const member of members) {
      await peoplePage.verifyPersonExists(member.firstName, member.lastName);
    }
  });
});
```

## Custom Test Base

### Extended Test with Custom Fixtures

```typescript
// tests/fixtures/test-base.ts
import { test as base, expect } from '@playwright/test';

// Custom fixtures
type MyFixtures = {
  testUser: {
    email: string;
    password: string;
  };
  apiHelper: {
    createTestData: () => Promise<void>;
    cleanupTestData: () => Promise<void>;
  };
};

// Extend base test with custom fixtures
export const test = base.extend<MyFixtures>({
  testUser: async ({}, use) => {
    const user = {
      email: process.env.TEST_EMAIL || 'test@example.com',
      password: process.env.TEST_PASSWORD || 'testpassword',
    };
    await use(user);
  },
  
  apiHelper: async ({ request }, use) => {
    const helper = {
      createTestData: async () => {
        // API calls to create test data
      },
      cleanupTestData: async () => {
        // API calls to cleanup test data
      },
    };
    
    // Setup
    await helper.createTestData();
    
    // Use the fixture
    await use(helper);
    
    // Cleanup
    await helper.cleanupTestData();
  },
});

export { expect };
```

## Utility Functions

### Navigation Utilities

```typescript
// tests/utils/navigation.ts
import { Page } from '@playwright/test';
import { SELECTORS } from '../selectors';

export class NavigationUtils {
  constructor(private page: Page) {}
  
  async navigateToModule(module: keyof typeof SELECTORS.nav) {
    await this.page.click(SELECTORS.nav[module]);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }
  
  async navigateViaMenu(menuPath: string[]) {
    for (const item of menuPath) {
      await this.page.click(`text=${item}`);
      await this.page.waitForTimeout(200); // Small delay for menu animations
    }
  }
  
  async verifyCurrentUrl(expectedPath: string) {
    await this.page.waitForURL(`**${expectedPath}**`);
  }
}
```

### Wait Utilities

```typescript
// tests/utils/waits.ts
import { Page } from '@playwright/test';

export class WaitUtils {
  constructor(private page: Page) {}
  
  async waitForApiResponse(endpoint: string) {
    await this.page.waitForResponse(
      response => response.url().includes(endpoint) && response.status() === 200
    );
  }
  
  async waitForNoSpinner() {
    await this.page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden' });
  }
  
  async waitForToast() {
    await this.page.waitForSelector('[data-testid="notification"]', { state: 'visible' });
    await this.page.waitForSelector('[data-testid="notification"]', { state: 'hidden' });
  }
  
  async waitForTableData() {
    await this.waitForNoSpinner();
    await this.page.waitForSelector('table tbody tr', { state: 'visible' });
  }
}
```

## Error Handling & Console Monitoring

### Console Error Detection

```typescript
// playwright.config.ts (add to use section)
use: {
  // Existing configuration...
  
  // Fail tests on console errors
  ignoreHTTPSErrors: false,
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
},

// tests/fixtures/test-base.ts (add to test extension)
test.beforeEach(async ({ page }) => {
  // Monitor console for errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`Console error: ${msg.text()}`);
      throw new Error(`Console error detected: ${msg.text()}`);
    }
  });
  
  // Monitor for uncaught exceptions
  page.on('pageerror', error => {
    console.error(`Page error: ${error.message}`);
    throw error;
  });
});
```

## CI/CD Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npm run test
      env:
        TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
        TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
        
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Best Practices

### 1. Test Naming Conventions
- Use descriptive test names that explain what is being tested
- Follow the pattern: `should [expected behavior] when [condition]`
- Group related tests using `test.describe()`

### 2. Test Organization
- One test file per feature or user flow
- Keep test files under 200 lines
- Extract complex logic into flows or utilities

### 3. Assertions
- Use specific assertions rather than generic ones
- Always verify the expected state after actions
- Include negative test cases

### 4. Data Management
- Clean up test data after each test
- Use unique identifiers for test data
- Never hard-code test data in specs

### 5. Performance
- Run tests in parallel where possible
- Use API calls for data setup when appropriate
- Minimize unnecessary waits

### 6. Debugging
- Use `test.only()` for debugging specific tests
- Leverage Playwright's trace viewer for failures
- Add meaningful error messages to assertions

## Maintenance Guidelines

### Adding New Tests
1. Add selectors to `tests/selectors/index.ts`
2. Create/update page object in `tests/pages/`
3. Create reusable flows if needed in `tests/flows/`
4. Write test spec in appropriate folder under `tests/specs/`
5. Update test data in `tests/fixtures/test-data.ts`

### Updating for UI Changes
1. Update selectors in central location
2. Update page object methods if behavior changed
3. Run affected tests to verify changes
4. Update flows if user journey changed

### Regular Maintenance Tasks
- Weekly: Review and update flaky tests
- Monthly: Audit selector usage and consolidate duplicates
- Quarterly: Review test coverage and identify gaps
- Annually: Major refactoring and optimization

## Test Execution Commands

```bash
# Run all tests
npm run test

# Run tests in UI mode for debugging
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run specific test file
npx playwright test tests/specs/people/member-management.spec.ts

# Run tests with specific tag
npx playwright test --grep @smoke

# Run tests in specific browser
npx playwright test --project=chromium

# Generate test report
npm run test:report

# Update snapshots
npx playwright test --update-snapshots

# Debug a specific test
npx playwright test --debug tests/specs/people/member-management.spec.ts
```

## Coverage Goals

### Phase 1: Core Functionality (Weeks 1-2)
- [ ] Authentication flow
- [ ] Navigation between modules
- [ ] Basic CRUD operations for People
- [ ] Basic Group management
- [ ] Simple donation entry

### Phase 2: Advanced Features (Weeks 3-4)
- [ ] Advanced search and filtering
- [ ] Batch operations
- [ ] Form submissions
- [ ] Reports generation
- [ ] Attendance tracking

### Phase 3: Edge Cases & Integration (Weeks 5-6)
- [ ] Permission-based access
- [ ] Multi-church scenarios
- [ ] Data import/export
- [ ] Email notifications
- [ ] Task automation

### Phase 4: Performance & Stress (Week 7)
- [ ] Load testing with multiple concurrent users
- [ ] Large data set handling
- [ ] Long-running operations
- [ ] API response time validation

## Success Metrics

- **Test Execution Time**: < 10 minutes for full suite
- **Test Stability**: < 1% flaky test rate
- **Code Coverage**: > 80% of critical user paths
- **Maintenance Time**: < 2 hours per week
- **Bug Detection Rate**: > 90% of regressions caught

## Conclusion

This testing strategy provides a robust, maintainable foundation for testing the CHUMS application. By following these guidelines and patterns, the test suite will remain simple to understand, easy to maintain, and resilient to UI changes while providing comprehensive coverage of application functionality.