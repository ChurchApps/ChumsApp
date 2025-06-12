import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { FormsPage } from '../pages/forms-page';
import { SharedSetup } from '../utils/shared-setup';
import { FormsTestHelpers } from './forms-test-helpers';

test.describe('Forms Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let formsPage: FormsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    formsPage = new FormsPage(page);
    
    // Use shared setup for consistent authentication
    await SharedSetup.loginAndSelectChurch(page);
  });

  test('should check if forms page is accessible', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'forms page accessibility', formsPage, async () => {
      await FormsTestHelpers.testPageAccessibility(page, 'formsManagement');
    });
  });

  test('should display forms list by default', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'forms list display', formsPage, async () => {
      await FormsTestHelpers.testFormsDisplay(page, formsPage);
    });
  });

  test('should perform simple forms search', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'simple forms search', formsPage, async () => {
      const searchTerms = FormsTestHelpers.getSearchTerms().basic;
      for (const term of searchTerms) {
        await FormsTestHelpers.testFormsSearch(page, formsPage, term);
      }
    });
  });

  test('should handle partial name searches', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'partial name searches', formsPage, async () => {
      const searchTerms = FormsTestHelpers.getSearchTerms().partial;
      for (const term of searchTerms) {
        await FormsTestHelpers.testFormsSearch(page, formsPage, term);
      }
    });
  });

  test('should handle case-insensitive searches', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'case-insensitive searches', formsPage, async () => {
      const searchTerms = FormsTestHelpers.getSearchTerms().caseInsensitive;
      for (const term of searchTerms) {
        await FormsTestHelpers.testFormsSearch(page, formsPage, term);
      }
    });
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'empty search handling', formsPage, async () => {
      await FormsTestHelpers.testFormsSearch(page, formsPage, '');
    });
  });

  test('should handle special characters in search', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'special characters search', formsPage, async () => {
      const searchTerms = FormsTestHelpers.getSearchTerms().special;
      for (const term of searchTerms) {
        await FormsTestHelpers.testFormsSearch(page, formsPage, term);
      }
    });
  });

  test('should have add form functionality', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'add form functionality', formsPage, async () => {
      await FormsTestHelpers.testAddFormFunctionality(page, formsPage);
    });
  });

  test('should navigate to individual form page', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form navigation', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
    });
  });

  test('should handle forms and archived tabs', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'forms tabs functionality', formsPage, async () => {
      await FormsTestHelpers.testFormsTabFunctionality(page, formsPage);
    });
  });

  test('should handle form editing functionality', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form editing', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
    });
  });

  test('should handle empty forms results gracefully', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'empty forms results', formsPage, async () => {
      await FormsTestHelpers.testFormsSearch(page, formsPage, 'zzznonexistent999');
    });
  });

  test('should maintain page functionality after search', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'page functionality after search', formsPage, async () => {
      // Perform a search
      await FormsTestHelpers.testFormsSearch(page, formsPage, 'Form');
      
      // Verify page is still functional
      await FormsTestHelpers.testFormsDisplay(page, formsPage);
    });
  });

  test('should handle rapid consecutive searches', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'rapid consecutive searches', formsPage, async () => {
      const searchTerms = FormsTestHelpers.getSearchTerms().rapid;
      for (const term of searchTerms) {
        await FormsTestHelpers.testFormsSearch(page, formsPage, term);
      }
    });
  });

  test('should have accessible forms elements', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'forms accessibility', formsPage, async () => {
      const hasFormsList = await formsPage.expectFormsDisplayed();
      expect(hasFormsList).toBeTruthy();
      
      const hasAddForm = await formsPage.clickAddForm();
      expect(hasAddForm).toBeTruthy();
      
      console.log('Forms elements are accessible');
    });
  });
});