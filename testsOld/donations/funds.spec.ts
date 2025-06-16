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
    
  });

  test('should check if funds page is accessible', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'funds page accessibility', fundsPage, async () => {
      await DonationsTestHelpers.testPageAccessibility(page, 'fundsManagement');
    });
  });

  test('should display funds list by default', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'funds list display', fundsPage, async () => {
      await DonationsTestHelpers.testFundsDisplay(page, fundsPage);
    });
  });

  test('should have add fund functionality', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'add fund functionality', fundsPage, async () => {
      await DonationsTestHelpers.testAddFundFunctionality(page, fundsPage);
    });
  });

  test('should have export functionality', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'export functionality', fundsPage, async () => {
      const exportAvailable = await fundsPage.expectExportAvailable();
      expect(exportAvailable).toBeTruthy();
      console.log('Export functionality available');
    });
  });

  test('should navigate to individual fund page', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund navigation', fundsPage, async () => {
      await DonationsTestHelpers.testFundNavigation(page, fundsPage);
    });
  });

  test('should handle fund search functionality', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund search', fundsPage, async () => {
      const searchTerms = ['Fund', 'General', 'Tithe'];
      for (const term of searchTerms) {
        await DonationsTestHelpers.testFundsSearch(page, fundsPage, term);
      }
    });
  });

  test('should handle empty fund search gracefully', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'empty fund search', fundsPage, async () => {
      await DonationsTestHelpers.testFundsSearch(page, fundsPage, '');
    });
  });

  test('should handle fund search with no results', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund search no results', fundsPage, async () => {
      await DonationsTestHelpers.testFundsSearch(page, fundsPage, 'zzznonexistent999');
    });
  });

  test('should maintain funds page functionality after search', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'funds page functionality after search', fundsPage, async () => {
      // Perform a search
      await DonationsTestHelpers.testFundsSearch(page, fundsPage, 'Fund');
      
      // Verify page is still functional
      await DonationsTestHelpers.testFundsDisplay(page, fundsPage);
    });
  });

  test('should handle fund management operations', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund management operations', fundsPage, async () => {
      await DonationsTestHelpers.testAddFundFunctionality(page, fundsPage);
    });
  });

  test('should have accessible fund elements', async ({ page }) => {
    await DonationsTestHelpers.performFundsPageTest(page, 'fund accessibility', fundsPage, async () => {
      // Check for proper funds structure
      const hasFundsList = await fundsPage.expectFundsDisplayed();
      expect(hasFundsList).toBeTruthy();
      
      const hasAddFund = await fundsPage.expectAddFundAvailable();
      expect(hasAddFund).toBeTruthy();
      
      console.log('Fund elements are accessible');
    });
  });
});