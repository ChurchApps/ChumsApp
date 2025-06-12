# CHUMS E2E Tests

This directory contains end-to-end tests for the CHUMS application using Playwright.

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm run test:e2e

# Run tests with UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Test Structure

```
tests/
├── auth/           # Authentication-related tests
├── pages/          # Page Object Models
├── utils/          # Test utilities and helpers
└── README.md       # This file
```

## Page Object Model

Tests use the Page Object Model pattern for maintainability:

- **LoginPage** (`tests/pages/login-page.ts`): Handles login page interactions
- **DashboardPage** (`tests/pages/dashboard-page.ts`): Handles dashboard interactions
- **TestHelpers** (`tests/utils/test-helpers.ts`): Common utilities

## Writing New Tests

1. **Create Page Objects**: For new pages, create a new page object in `tests/pages/`
2. **Use Test Helpers**: Leverage the TestHelpers class for common actions
3. **Follow Naming Conventions**: Use descriptive test names and organize by feature
4. **Handle Async Operations**: Always await async operations and use appropriate waits

## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Feature Name', () => {
  let page: Page;
  let featurePage: FeaturePage;

  test.beforeEach(async ({ page }) => {
    featurePage = new FeaturePage(page);
    // Setup common to all tests
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
  });
});
```

## Test Credentials

- **Demo Email**: demo@chums.org
- **Demo Password**: password

## Configuration

Test configuration is in `playwright.config.ts`:
- Tests run on multiple browsers (Chrome, Firefox, Safari)
- Includes mobile testing
- Automatic retry on failure
- Screenshots and videos on failure
- Test server auto-start

## Tips

1. **Use Selectors Wisely**: Prefer data-testid attributes or semantic selectors
2. **Wait for Elements**: Always wait for elements to be ready before interacting
3. **Independent Tests**: Each test should be independent and not rely on others
4. **Clean State**: Use beforeEach to ensure clean state for each test
5. **Descriptive Names**: Use clear, descriptive test names that explain what is being tested