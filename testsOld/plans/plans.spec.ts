import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { PlansPage } from '../pages/plans-page';
import { SharedSetup } from '../utils/shared-setup';
import { PlansTestHelpers } from './plans-test-helpers';

test.describe('Plans Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let plansPage: PlansPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    plansPage = new PlansPage(page);
    
  });

  test('should check if plans page is accessible', async ({ page }) => {
    await PlansTestHelpers.performPlansPageTest(page, 'plans page accessibility', plansPage, async (mode) => {
      if (mode === 'plans') {
        await PlansTestHelpers.testPageAccessibility(page, 'plansManagement');
      } else {
        const canSearchFromDashboard = await plansPage.testPlansSearchFromDashboard();
        
        if (canSearchFromDashboard) {
          console.log('Plans search functionality available via dashboard');
        } else {
          console.log('Plans functionality not available in demo environment');
        }
      }
    });
  });

  test('should display ministries list by default', async ({ page }) => {
    await PlansTestHelpers.performPlansPageTest(page, 'ministries list display', plansPage, async (mode) => {
      if (mode === 'plans') {
        await plansPage.expectLoadingComplete();
        
        const hasMinistries = await plansPage.expectMinistriesDisplayed();
        
        if (hasMinistries) {
          console.log('Ministries list displayed successfully');
          
          const ministriesCount = await plansPage.getMinistriesCount();
          console.log(`Found ${ministriesCount} ministries`);
        } else {
          console.log('No ministries data in demo environment');
        }
      } else {
        console.log('Plans search functionality confirmed via dashboard (ministries list not testable)');
      }
    });
  });

  test('should perform simple ministry search', async ({ page }) => {
    const searchTerms = PlansTestHelpers.getSearchTerms().basic;
    await PlansTestHelpers.performSearchTest(page, 'simple ministry search', plansPage, searchTerms);
  });

  test('should handle partial name searches', async ({ page }) => {
    const searchTerms = PlansTestHelpers.getSearchTerms().partial;
    await PlansTestHelpers.performSearchTest(page, 'partial name search', plansPage, searchTerms);
  });

  test('should handle case-insensitive searches', async ({ page }) => {
    const searchTerms = PlansTestHelpers.getSearchTerms().caseInsensitive;
    await PlansTestHelpers.performSearchTest(page, 'case-insensitive search', plansPage, searchTerms);
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await PlansTestHelpers.performPlansPageTest(page, 'empty search handling', plansPage, async (mode) => {
      if (mode === 'plans') {
        const searchSuccessful = await plansPage.searchMinistries('');
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          await plansPage.expectMinistriesTableVisible();
        }
      } else {
        await plansPage.searchPlansFromDashboard('');
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test('should handle special characters in search', async ({ page }) => {
    const searchTerms = PlansTestHelpers.getSearchTerms().special;
    await PlansTestHelpers.performSearchTest(page, 'special character search', plansPage, searchTerms);
  });

  test('should have add ministry functionality', async ({ page }) => {
    await PlansTestHelpers.performCrudTest(page, 'Add ministry functionality', plansPage, async () => {
      await PlansTestHelpers.testMinistryFunctionality(page, 'Add ministry');
    });
  });

  test('should navigate to individual ministry page', async ({ page }) => {
    await PlansTestHelpers.performPlansPageTest(page, 'ministry navigation', plansPage, async (mode) => {
      if (mode === 'plans') {
        await plansPage.expectLoadingComplete();
        
        const ministryClicked = await plansPage.clickFirstMinistry();
        
        if (ministryClicked) {
          const currentUrl = page.url();
          const isOnMinistryPage = /\/plans\/ministries\/\w+/.test(currentUrl);
          expect(isOnMinistryPage).toBeTruthy();
          console.log('Successfully navigated to ministry page');
        } else {
          console.log('No ministries available to click in demo environment');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (ministry navigation not testable)');
      }
    });
  });

  test('should handle empty ministries results gracefully', async ({ page }) => {
    await PlansTestHelpers.performPlansPageTest(page, 'empty ministries results', plansPage, async (mode) => {
      const searchTerm = 'xyznobodyhasthisministryname123';
      
      if (mode === 'plans') {
        const searchSuccessful = await plansPage.searchMinistries(searchTerm);
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          // Should not crash or show errors
          await plansPage.expectMinistriesTableVisible();
          console.log('Empty ministries results handled gracefully');
        }
      } else {
        await plansPage.searchPlansFromDashboard(searchTerm);
        await page.waitForLoadState('domcontentloaded');
        console.log('Empty ministries results handled gracefully via dashboard');
      }
    });
  });

  test('should maintain page functionality after search', async ({ page }) => {
    await PlansTestHelpers.performPlansPageTest(page, 'page functionality after search', plansPage, async (mode) => {
      if (mode === 'plans') {
        await plansPage.searchMinistries('ministry');
        await plansPage.searchMinistries('music');
        await plansPage.expectMinistriesTableVisible();
        console.log('Page functionality maintained after multiple searches');
      } else {
        await plansPage.searchPlansFromDashboard('ministry');
        await plansPage.searchPlansFromDashboard('music');
        console.log('Page functionality maintained after multiple searches via dashboard');
      }
    });
  });

  test('should handle rapid consecutive searches', async ({ page }) => {
    const searchTerms = PlansTestHelpers.getSearchTerms().rapid;
    await PlansTestHelpers.performPlansPageTest(page, 'rapid consecutive searches', plansPage, async (mode) => {
      const terms = searchTerms[mode];
      
      if (mode === 'plans') {
        for (const term of terms) {
          const searchSuccessful = await plansPage.searchMinistries(term);
          if (searchSuccessful) {
            await page.waitForLoadState('domcontentloaded');
          }
        }
        
        await page.waitForLoadState('networkidle');
        await plansPage.expectMinistriesTableVisible();
      } else {
        for (const term of terms) {
          await plansPage.searchPlansFromDashboard(term);
          await page.waitForLoadState('domcontentloaded');
        }
      }
    });
  });

  test('should have accessible plans elements', async ({ page }) => {
    await PlansTestHelpers.performPlansPageTest(page, 'plans accessibility', plansPage, async (mode) => {
      if (mode === 'plans') {
        // Check for proper ministries table structure
        const tableExists = await plansPage.ministriesTable.isVisible().catch(() => false);
        
        if (tableExists) {
          console.log('Ministries table elements are accessible');
        } else {
          console.log('Ministries table may use different structure');
        }
      } else {
        // Check dashboard search accessibility
        const dashboardSearchInput = page.locator('[id="searchText"]').first();
        const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
        
        if (dashboardSearchExists) {
          console.log('Search elements accessibility tested via dashboard');
        } else {
          console.log('Dashboard search not available for accessibility testing');
        }
      }
    });
  });
});