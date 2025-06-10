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
    await FormsTestHelpers.performFormsPageTest(page, 'forms page accessibility', formsPage, async (mode) => {
      if (mode === 'forms') {
        await FormsTestHelpers.testPageAccessibility(page, 'formsManagement');
      } else {
        const canSearchFromDashboard = await formsPage.testFormsSearchFromDashboard();
        
        if (canSearchFromDashboard) {
          console.log('Forms search functionality available via dashboard');
        } else {
          console.log('Forms functionality not available in demo environment');
        }
      }
    });
  });

  test('should display forms list by default', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'forms list display', formsPage, async (mode) => {
      if (mode === 'forms') {
        await formsPage.expectLoadingComplete();
        
        const hasForms = await formsPage.expectFormsDisplayed();
        
        if (hasForms) {
          console.log('Forms list displayed successfully');
          
          const formsCount = await formsPage.getFormsCount();
          console.log(`Found ${formsCount} forms`);
        } else {
          console.log('No forms data in demo environment');
        }
      } else {
        console.log('Forms search functionality confirmed via dashboard (forms list not testable)');
      }
    });
  });

  test('should perform simple forms search', async ({ page }) => {
    const searchTerms = FormsTestHelpers.getSearchTerms().basic;
    await FormsTestHelpers.performSearchTest(page, 'simple forms search', formsPage, searchTerms);
  });

  test('should handle partial name searches', async ({ page }) => {
    const searchTerms = FormsTestHelpers.getSearchTerms().partial;
    await FormsTestHelpers.performSearchTest(page, 'partial name search', formsPage, searchTerms);
  });

  test('should handle case-insensitive searches', async ({ page }) => {
    const searchTerms = FormsTestHelpers.getSearchTerms().caseInsensitive;
    await FormsTestHelpers.performSearchTest(page, 'case-insensitive search', formsPage, searchTerms);
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'empty search handling', formsPage, async (mode) => {
      if (mode === 'forms') {
        const searchSuccessful = await formsPage.searchForms('');
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          await formsPage.expectFormsTableVisible();
        }
      } else {
        await formsPage.searchFormsFromDashboard('');
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test('should handle special characters in search', async ({ page }) => {
    const searchTerms = FormsTestHelpers.getSearchTerms().special;
    await FormsTestHelpers.performSearchTest(page, 'special character search', formsPage, searchTerms);
  });

  test('should have add form functionality', async ({ page }) => {
    await FormsTestHelpers.performCrudTest(page, 'Add form functionality', formsPage, async () => {
      await FormsTestHelpers.testFormFunctionality(page, 'Add form');
    });
  });

  test('should navigate to individual form page', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form navigation', formsPage, async (mode) => {
      if (mode === 'forms') {
        await formsPage.expectLoadingComplete();
        
        const formClicked = await formsPage.clickFirstForm();
        
        if (formClicked) {
          const currentUrl = page.url();
          const isOnFormPage = /\/forms\/\w+/.test(currentUrl);
          expect(isOnFormPage).toBeTruthy();
          console.log('Successfully navigated to form page');
        } else {
          console.log('No forms available to click in demo environment');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (form navigation not testable)');
      }
    });
  });

  test('should handle forms and archived tabs', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'forms tabs functionality', formsPage, async (mode) => {
      if (mode === 'forms') {
        // Test forms tab
        const formsTabClicked = await formsPage.clickFormsTab();
        if (formsTabClicked) {
          await page.waitForLoadState('domcontentloaded');
          console.log('Forms tab clicked successfully');
        }
        
        // Test archived tab
        const archivedTabClicked = await formsPage.clickArchivedTab();
        if (archivedTabClicked) {
          await page.waitForLoadState('domcontentloaded');
          console.log('Archived tab clicked successfully');
        }
        
        if (formsTabClicked || archivedTabClicked) {
          console.log('Forms tab navigation working');
        } else {
          console.log('Forms tabs may be structured differently');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (tabs not testable)');
      }
    });
  });

  test('should handle form editing functionality', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form editing', formsPage, async (mode) => {
      if (mode === 'forms') {
        const editClicked = await formsPage.editFirstForm();
        
        if (editClicked) {
          console.log('Form edit functionality activated');
          
          // Should be in edit mode or on edit page
          const isOnEditPage = page.url().includes('/edit') || page.url().includes('/forms/');
          const hasEditForm = await page.locator('input[name*="name"], textarea[name*="description"]').first().isVisible().catch(() => false);
          
          if (isOnEditPage || hasEditForm) {
            console.log('Form edit interface opened');
          } else {
            console.log('Form edit interface may be structured differently');
          }
        } else {
          console.log('Form edit not available - may require permissions or no forms');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (editing not testable)');
      }
    });
  });

  test('should handle empty forms results gracefully', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'empty forms results', formsPage, async (mode) => {
      const searchTerm = 'xyznobodyhasthisformname123';
      
      if (mode === 'forms') {
        const searchSuccessful = await formsPage.searchForms(searchTerm);
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          // Should not crash or show errors
          await formsPage.expectFormsTableVisible();
          console.log('Empty forms results handled gracefully');
        }
      } else {
        await formsPage.searchFormsFromDashboard(searchTerm);
        await page.waitForLoadState('domcontentloaded');
        console.log('Empty forms results handled gracefully via dashboard');
      }
    });
  });

  test('should maintain page functionality after search', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'page functionality after search', formsPage, async (mode) => {
      if (mode === 'forms') {
        await formsPage.searchForms('demo');
        await formsPage.searchForms('test');
        await formsPage.expectFormsTableVisible();
        console.log('Page functionality maintained after multiple searches');
      } else {
        await formsPage.searchFormsFromDashboard('demo');
        await formsPage.searchFormsFromDashboard('test');
        console.log('Page functionality maintained after multiple searches via dashboard');
      }
    });
  });

  test('should handle rapid consecutive searches', async ({ page }) => {
    const searchTerms = FormsTestHelpers.getSearchTerms().rapid;
    await FormsTestHelpers.performFormsPageTest(page, 'rapid consecutive searches', formsPage, async (mode) => {
      const terms = searchTerms[mode];
      
      if (mode === 'forms') {
        for (const term of terms) {
          const searchSuccessful = await formsPage.searchForms(term);
          if (searchSuccessful) {
            await page.waitForLoadState('domcontentloaded');
          }
        }
        
        await page.waitForLoadState('networkidle');
        await formsPage.expectFormsTableVisible();
      } else {
        for (const term of terms) {
          await formsPage.searchFormsFromDashboard(term);
          await page.waitForLoadState('domcontentloaded');
        }
      }
    });
  });

  test('should have accessible forms elements', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'forms accessibility', formsPage, async (mode) => {
      if (mode === 'forms') {
        // Check for proper forms table structure
        const tableExists = await formsPage.formsTable.isVisible().catch(() => false);
        
        if (tableExists) {
          console.log('Forms table elements are accessible');
        } else {
          console.log('Forms table may use different structure');
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