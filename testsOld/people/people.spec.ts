import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { PeoplePage } from '../pages/people-page';
import { SharedSetup } from '../utils/shared-setup';
import { PeopleTestHelpers } from './people-test-helpers';

test.describe('People Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let peoplePage: PeoplePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    peoplePage = new PeoplePage(page);
  });

  test('should check if people page is accessible', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'people page accessibility', peoplePage, async () => {
      await PeopleTestHelpers.testPageAccessibility(page, 'peopleManagement');
    });
  });

  test('should display recent people by default', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'people display', peoplePage, async () => {
      await PeopleTestHelpers.testPeopleDisplay(page, peoplePage);
    });
  });

  test('should perform simple people search', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'simple people search', peoplePage, async () => {
      const searchTerms = PeopleTestHelpers.getSearchTerms().basic;
      for (const term of searchTerms) {
        await PeopleTestHelpers.testPeopleSearch(page, peoplePage, term);
      }
    });
  });

  test('should have working search functionality with Enter key', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'search with Enter key', peoplePage, async () => {
      await PeopleTestHelpers.testPeopleSearch(page, peoplePage, 'Smith');
    });
  });

  test('should show advanced search option', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'advanced search', peoplePage, async () => {
      await PeopleTestHelpers.testAdvancedSearch(page, peoplePage);
    });
  });

  test('should have export functionality', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'export functionality', peoplePage, async () => {
      await PeopleTestHelpers.testExportFunctionality(page, peoplePage);
    });
  });

  test('should have column selector functionality', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'column selector', peoplePage, async () => {
      await PeopleTestHelpers.testColumnSelector(page, peoplePage);
    });
  });

  test('should navigate to individual person page', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person navigation', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
    });
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'empty search results', peoplePage, async () => {
      await PeopleTestHelpers.testPeopleSearch(page, peoplePage, 'zzznonexistent999');
    });
  });

  test('should maintain page functionality after search', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'page functionality after search', peoplePage, async () => {
      // Perform a search
      await PeopleTestHelpers.testPeopleSearch(page, peoplePage, 'Smith');
      
      // Verify page is still functional
      await PeopleTestHelpers.testPeopleDisplay(page, peoplePage);
    });
  });

  test('should have accessible search elements', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'search accessibility', peoplePage, async () => {
      const hasPeopleList = await peoplePage.expectPeopleDisplayed();
      expect(hasPeopleList).toBeTruthy();
      
      const hasExport = await peoplePage.expectExportAvailable();
      expect(hasExport).toBeTruthy();
      
      console.log('People search elements are accessible');
    });
  });
});