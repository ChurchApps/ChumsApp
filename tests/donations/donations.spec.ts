import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { DonationsPage } from '../pages/donations-page';
import { SharedSetup } from '../utils/shared-setup';
import { DonationsTestHelpers } from './donations-test-helpers';

test.describe('Donations Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let donationsPage: DonationsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    donationsPage = new DonationsPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.login('demo@chums.org', 'password');
    await loginPage.expectSuccessfulLogin();
    
    // Handle church selection modal
    const churchSelectionDialog = page.locator('text=Select a Church');
    const isChurchSelectionVisible = await churchSelectionDialog.isVisible().catch(() => false);
    
    if (isChurchSelectionVisible) {
      // Click on Grace Community Church
      const graceChurch = page.locator('text=Grace Community Church').first();
      await graceChurch.click();
      // Wait for church selection to complete
      await page.waitForSelector('h1:has-text("Chums")', { timeout: 10000 });
    }
    
    await dashboardPage.expectUserIsLoggedIn();
  });

  test('should check if donations page is accessible', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'donations page accessibility', donationsPage, async () => {
      await DonationsTestHelpers.testPageAccessibility(page, 'donationsReport');
    });
  });

  test('should display donations report by default', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'donations report display', donationsPage, async () => {
      await DonationsTestHelpers.testDonationsDisplay(page, donationsPage);
    });
  });

  test('should perform simple donations search', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'simple donations search', donationsPage, async () => {
      const searchTerms = DonationsTestHelpers.getSearchTerms().basic;
      for (const term of searchTerms) {
        await DonationsTestHelpers.testDonationsSearch(page, donationsPage, term);
      }
    });
  });

  test('should handle amount-based searches', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'amount-based searches', donationsPage, async () => {
      const searchTerms = DonationsTestHelpers.getSearchTerms().amounts;
      for (const term of searchTerms) {
        await DonationsTestHelpers.testDonationsSearch(page, donationsPage, term);
      }
    });
  });

  test('should handle case-insensitive searches', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'case-insensitive searches', donationsPage, async () => {
      const searchTerms = DonationsTestHelpers.getSearchTerms().caseInsensitive;
      for (const term of searchTerms) {
        await DonationsTestHelpers.testDonationsSearch(page, donationsPage, term);
      }
    });
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'empty search handling', donationsPage, async () => {
      await DonationsTestHelpers.testDonationsSearch(page, donationsPage, '');
    });
  });

  test('should have export functionality', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'export functionality', donationsPage, async () => {
      await DonationsTestHelpers.testDonationsExport(page, donationsPage);
    });
  });

  test('should have filter functionality', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'filter functionality', donationsPage, async () => {
      await DonationsTestHelpers.testDonationFiltering(page, donationsPage);
    });
  });

  test('should display donation totals', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'donation totals display', donationsPage, async () => {
      await DonationsTestHelpers.testDonationTotals(page, donationsPage);
    });
  });

  test('should handle empty donation results gracefully', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'empty donation results', donationsPage, async () => {
      // Search for something that likely won't exist
      await DonationsTestHelpers.testDonationsSearch(page, donationsPage, 'zzznonexistent999');
    });
  });

  test('should maintain page functionality after search', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'page functionality after search', donationsPage, async () => {
      // Perform a search
      await DonationsTestHelpers.testDonationsSearch(page, donationsPage, 'Donation');
      
      // Verify page is still functional
      await DonationsTestHelpers.testDonationsDisplay(page, donationsPage);
    });
  });

  test('should handle rapid consecutive searches', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'rapid consecutive searches', donationsPage, async () => {
      const searchTerms = DonationsTestHelpers.getSearchTerms().rapid;
      for (const term of searchTerms) {
        await DonationsTestHelpers.testDonationsSearch(page, donationsPage, term);
      }
    });
  });

  test('should have accessible donation elements', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'donation accessibility', donationsPage, async () => {
      // Check for proper donations structure
      const hasReport = await donationsPage.expectDonationsReportVisible();
      expect(hasReport).toBeTruthy();
      
      const hasExport = await donationsPage.expectExportAvailable();
      expect(hasExport).toBeTruthy();
      
      console.log('Donation elements are accessible');
    });
  });
});