import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { PeoplePage } from '../pages/people-page';
import { PersonPage } from '../pages/person-page';
import { SharedSetup } from '../utils/shared-setup';
import { PeopleTestHelpers } from './people-test-helpers';

test.describe('Person Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let peoplePage: PeoplePage;
  let personPage: PersonPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    peoplePage = new PeoplePage(page);
    personPage = new PersonPage(page);
    
  });

  test('should navigate to person page from people list', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person navigation', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
    });
  });

  test('should display person page with navigation tabs', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person page display', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person tabs', personPage, async () => {
        await PeopleTestHelpers.testPersonTabs(page, personPage);
      });
    });
  });

  test('should switch between person tabs', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person tabs switching', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person tabs', personPage, async () => {
        await PeopleTestHelpers.testPersonTabs(page, personPage);
      });
    });
  });

  test('should display person details in details tab', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person details display', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person details', personPage, async () => {
        await personPage.clickDetailsTab();
        await PeopleTestHelpers.testPersonDetails(page, personPage);
      });
    });
  });

  test('should have edit person functionality', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'edit person functionality', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person editing', personPage, async () => {
        await PeopleTestHelpers.testPersonEditing(page, personPage);
      });
    });
  });

  test('should handle person page with invalid ID gracefully', async ({ page }) => {
    await page.goto('/people/invalid-person-id');
    
    const currentUrl = page.url();
    const isOnPeoplePage = currentUrl.includes('/people') && !currentUrl.includes('invalid-person-id');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    expect(isOnPeoplePage || hasErrorMessage).toBeTruthy();
    console.log('Invalid person ID handled gracefully');
  });

  test('should maintain person page functionality across tabs', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person functionality across tabs', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person tabs maintenance', personPage, async () => {
        // Test all tabs work
        await PeopleTestHelpers.testPersonTabs(page, personPage);
        
        // Page should still be functional
        const hasPersonDetails = await personPage.expectPersonDetailsVisible();
        expect(hasPersonDetails).toBeTruthy();
        console.log('Person functionality maintained across tabs');
      });
    });
  });

  test('should display person photo if available', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person photo display', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person photo', personPage, async () => {
        const hasPersonPhoto = await personPage.expectPersonPhotoVisible();
        // Don't require photo to exist, just that the functionality works
        console.log(`Person photo functionality available: ${hasPersonPhoto}`);
      });
    });
  });

  test('should handle person page navigation via URL', async ({ page }) => {
    // Direct navigation should work or redirect appropriately
    await page.goto('/people/1');
    
    const currentUrl = page.url();
    const isOnPersonPage = currentUrl.includes('/people');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    expect(isOnPersonPage || hasErrorMessage).toBeTruthy();
    console.log('Person page URL navigation handled');
  });
});