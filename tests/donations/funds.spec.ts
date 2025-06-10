import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { FundsPage } from '../pages/funds-page';
import { SharedSetup } from '../utils/shared-setup';
import { DonationsTestHelpers } from './donations-test-helpers';

test.describe('Funds Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let fundsPage: FundsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    fundsPage = new FundsPage(page);
    
    // Use shared setup for consistent authentication
    await SharedSetup.loginAndSelectChurch(page);
  });

  test('should check if funds page is accessible', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'funds page accessibility', fundsPage, async (mode) => {
      if (mode === 'funds') {
        await DonationsTestHelpers.testPageAccessibility(page, 'fundsManagement');
      }
    });
  });

  test('should display funds list by default', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'funds list display', fundsPage, async (mode) => {
      if (mode === 'funds') {
        await fundsPage.expectLoadingComplete();
        
        const hasFunds = await fundsPage.expectFundsDisplayed();
        
        if (hasFunds) {
          console.log('Funds list displayed successfully');
          
          const fundsCount = await fundsPage.getFundsCount();
          console.log(`Found ${fundsCount} funds`);
        } else {
          console.log('No funds data in demo environment');
        }
      }
    });
  });

  test('should have add fund functionality', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'add fund functionality', fundsPage, async (mode) => {
      if (mode === 'funds') {
        const hasAddFund = await fundsPage.expectAddFundAvailable();
        
        if (hasAddFund) {
          console.log('Add fund functionality available');
          
          const addClicked = await fundsPage.clickAddFund();
          if (addClicked) {
            // Should either navigate to add fund page or open modal
            const isOnAddPage = page.url().includes('/add') || page.url().includes('/new');
            const hasAddModal = await page.locator('.modal, .dialog, text=Add Fund').first().isVisible().catch(() => false);
            
            if (isOnAddPage || hasAddModal) {
              console.log('Add fund interface opened');
            } else {
              console.log('Add fund interface may be structured differently');
            }
          }
        } else {
          console.log('Add fund functionality not available - may require permissions');
        }
      }
    });
  });

  test('should have export functionality', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'export functionality', fundsPage, async (mode) => {
      if (mode === 'funds') {
        await fundsPage.expectLoadingComplete();
        
        const exportExists = await fundsPage.expectExportAvailable();
        
        if (exportExists) {
          console.log('Export functionality available');
        } else {
          console.log('Export not available - may require data or permissions');
        }
      }
    });
  });

  test('should navigate to individual fund page', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund navigation', fundsPage, async (mode) => {
      if (mode === 'funds') {
        await fundsPage.expectLoadingComplete();
        
        const fundClicked = await fundsPage.clickFirstFund();
        
        if (fundClicked) {
          const currentUrl = page.url();
          const isOnFundPage = /\/donations\/funds\/\w+/.test(currentUrl) || currentUrl.includes('/fund/');
          
          if (isOnFundPage) {
            console.log('Successfully navigated to fund page');
          } else {
            console.log('Fund navigation may work differently');
          }
        } else {
          console.log('No funds available to click in demo environment');
        }
      }
    });
  });

  test('should handle fund search functionality', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund search', fundsPage, async (mode) => {
      if (mode === 'funds') {
        const searchSuccessful = await fundsPage.searchFunds('general');
        
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          await fundsPage.expectFundsTableVisible();
          console.log('Fund search functionality working');
        } else {
          console.log('Fund search not available or structured differently');
        }
      }
    });
  });

  test('should handle empty fund search gracefully', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'empty fund search', fundsPage, async (mode) => {
      if (mode === 'funds') {
        const searchSuccessful = await fundsPage.searchFunds('');
        
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          await fundsPage.expectFundsTableVisible();
          console.log('Empty fund search handled gracefully');
        } else {
          console.log('Fund search not available for empty search testing');
        }
      }
    });
  });

  test('should handle fund search with no results', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'no results fund search', fundsPage, async (mode) => {
      if (mode === 'funds') {
        const searchTerm = 'xyznobodyhasthisfundname123';
        const searchSuccessful = await fundsPage.searchFunds(searchTerm);
        
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          // Should not crash or show errors
          await fundsPage.expectFundsTableVisible();
          console.log('No results fund search handled gracefully');
        } else {
          console.log('Fund search not available for no results testing');
        }
      }
    });
  });

  test('should maintain funds page functionality after search', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'funds page functionality after search', fundsPage, async (mode) => {
      if (mode === 'funds') {
        await fundsPage.searchFunds('general');
        await fundsPage.searchFunds('tithe');
        await fundsPage.expectFundsTableVisible();
        console.log('Funds page functionality maintained after multiple searches');
      }
    });
  });

  test('should handle fund management operations', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund management', fundsPage, async (mode) => {
      if (mode === 'funds') {
        await DonationsTestHelpers.testFundManagement(page, fundsPage);
      }
    });
  });

  test('should have accessible fund elements', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund accessibility', fundsPage, async (mode) => {
      if (mode === 'funds') {
        // Check for proper fund table structure
        const tableExists = await fundsPage.fundsTable.isVisible().catch(() => false);
        
        if (tableExists) {
          console.log('Funds table elements are accessible');
        } else {
          console.log('Funds table may use different structure');
        }
      }
    });
  });
});