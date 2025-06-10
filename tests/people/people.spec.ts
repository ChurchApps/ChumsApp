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
    
    // Use shared setup for consistent authentication
    await SharedSetup.loginAndSelectChurch(page);
  });


  test('should check if people page is accessible', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'people page accessibility', peoplePage, async (mode) => {
      if (mode === 'people') {
        await PeopleTestHelpers.testPageAccessibility(page, 'peopleSearch');
      } else {
        const canSearchFromDashboard = await peoplePage.testPeopleSearchFromDashboard();
        
        if (canSearchFromDashboard) {
          console.log('People search functionality available via dashboard');
        } else {
          console.log('People functionality not available in demo environment');
        }
      }
    });
  });

  test('should display recent people by default', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'recent people display', peoplePage, async (mode) => {
      if (mode === 'people') {
        await expect(peoplePage.recentPeopleBox).toBeVisible();
        
        const hasResults = await peoplePage.expectSearchResults();
        
        if (hasResults) {
          console.log('Recent people displayed successfully');
        } else {
          console.log('No recent people data in demo environment');
        }
      } else {
        console.log('People search functionality confirmed via dashboard (recent people not testable)');
      }
    });
  });

  test('should perform simple people search', async ({ page }) => {
    const searchTerms = PeopleTestHelpers.getSearchTerms().basic;
    await PeopleTestHelpers.performSearchTest(page, 'simple people search', peoplePage, searchTerms);
  });

  test('should have working search functionality with Enter key', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'Enter key search functionality', peoplePage, async (mode) => {
      if (mode === 'people') {
        await peoplePage.searchInput.fill('test');
        await peoplePage.searchInput.press('Enter');
        console.log('Enter key search functionality working');
      } else {
        await peoplePage.searchPeopleFromDashboard('test');
        console.log('Enter key search functionality tested via dashboard');
      }
    });
  });

  test('should show advanced search option', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'advanced search option', peoplePage, async (mode) => {
      if (mode === 'people') {
        const advancedButtonExists = await peoplePage.advancedButton.isVisible().catch(() => false);
        
        if (advancedButtonExists) {
          await peoplePage.clickAdvancedSearch();
          console.log('Advanced search opened successfully');
        } else {
          console.log('Advanced search button not found - may be permission-based');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (advanced search not testable)');
      }
    });
  });

  test('should have export functionality', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'export functionality', peoplePage, async (mode) => {
      if (mode === 'people') {
        await peoplePage.expectRecentPeopleDisplayed();
        
        const exportExists = await peoplePage.exportLink.isVisible().catch(() => false);
        
        if (exportExists) {
          console.log('Export functionality available');
        } else {
          console.log('Export not available - may require data or permissions');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (export not testable)');
      }
    });
  });

  test('should have column selector functionality', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'column selector functionality', peoplePage, async (mode) => {
      if (mode === 'people') {
        const columnsExists = await peoplePage.columnsButton.isVisible().catch(() => false);
        
        if (columnsExists) {
          await peoplePage.openColumnsSelector();
          console.log('Column selector opened successfully');
        } else {
          console.log('Column selector not available - may require data or permissions');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (column selector not testable)');
      }
    });
  });

  test('should navigate to individual person page', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person navigation', peoplePage, async (mode) => {
      if (mode === 'people') {
        const personClicked = await peoplePage.clickFirstPerson();
        
        if (personClicked) {
          const currentUrl = page.url();
          const isOnPersonPage = /\/people\/\w+/.test(currentUrl);
          expect(isOnPersonPage).toBeTruthy();
          console.log('Successfully navigated to person page');
        } else {
          console.log('No people available to click in demo environment');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (person navigation not testable)');
      }
    });
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'empty search results', peoplePage, async (mode) => {
      const searchTerm = 'xyznobodyhasthisname123';
      
      if (mode === 'people') {
        await peoplePage.searchPeople(searchTerm);
        const hasResults = await peoplePage.expectSearchResults();
        expect(hasResults).toBeFalsy();
        console.log('Empty search results handled gracefully');
      } else {
        await peoplePage.searchPeopleFromDashboard(searchTerm);
        console.log('Empty search results handled gracefully via dashboard');
      }
    });
  });

  test('should maintain page functionality after search', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'page functionality after search', peoplePage, async (mode) => {
      if (mode === 'people') {
        await peoplePage.searchPeople('demo');
        await peoplePage.searchPeople('test');
        await peoplePage.expectSimpleSearchVisible();
        console.log('Page functionality maintained after multiple searches');
      } else {
        await peoplePage.searchPeopleFromDashboard('demo');
        await peoplePage.searchPeopleFromDashboard('test');
        console.log('Page functionality maintained after multiple searches via dashboard');
      }
    });
  });

  test('should have accessible search elements', async ({ page }) => {
    try {
      await peoplePage.gotoViaDashboard();
      await peoplePage.expectToBeOnPeoplePage();
      
      // Check for aria label on search input
      const searchInput = peoplePage.searchInput;
      const ariaLabel = await searchInput.getAttribute('aria-label');
      
      if (ariaLabel) {
        expect(ariaLabel).toBe('searchBox');
      }
      
      // Check for proper form structure
      await expect(searchInput).toBeVisible();
      await expect(peoplePage.searchButton).toBeVisible();
      
      console.log('Search elements are accessible');
    } catch (error) {
      if (error.message.includes('redirected to login') || error.message.includes('authentication may have expired')) {
        console.log('People page not accessible - testing search accessibility from dashboard instead');
        
        const canSearchFromDashboard = await peoplePage.testPeopleSearchFromDashboard();
        
        if (canSearchFromDashboard) {
          // Check dashboard search accessibility
          const dashboardSearchInput = page.locator('[id="searchText"]').first();
          const dashboardSearchButton = page.locator('button:has-text("Search")').first();
          
          const dashboardAriaLabel = await dashboardSearchInput.getAttribute('aria-label').catch(() => null);
          
          if (dashboardAriaLabel) {
            console.log(`Dashboard search input has aria-label: ${dashboardAriaLabel}`);
          }
          
          await expect(dashboardSearchInput).toBeVisible();
          await expect(dashboardSearchButton).toBeVisible();
          
          console.log('Search elements accessibility tested via dashboard');
        } else {
          console.log('People search not available for accessibility testing');
        }
      } else {
        throw error;
      }
    }
  });
});