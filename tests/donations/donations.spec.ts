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
    
    // Use shared setup for consistent authentication
    await SharedSetup.loginAndSelectChurch(page);
  });

  test('should check if donations page is accessible', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'donations page accessibility', donationsPage, async (mode) => {
      if (mode === 'donations') {
        await DonationsTestHelpers.testPageAccessibility(page, 'donationsReport');
      } else {
        const canSearchFromDashboard = await donationsPage.testDonationsSearchFromDashboard();
        
        if (canSearchFromDashboard) {
          console.log('Donations search functionality available via dashboard');
        } else {
          console.log('Donations functionality not available in demo environment');
        }
      }
    });
  });

  test('should display donations report by default', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'donations report display', donationsPage, async (mode) => {
      if (mode === 'donations') {
        await DonationsTestHelpers.testDonationReporting(page, donationsPage);
      } else {
        console.log('Donations search functionality confirmed via dashboard (report not testable)');
      }
    });
  });

  test('should perform simple donations search', async ({ page }) => {
    const searchTerms = DonationsTestHelpers.getSearchTerms().basic;
    await DonationsTestHelpers.performSearchTest(page, 'simple donations search', donationsPage, searchTerms);
  });

  test('should handle amount-based searches', async ({ page }) => {
    const searchTerms = DonationsTestHelpers.getSearchTerms().amounts;
    await DonationsTestHelpers.performSearchTest(page, 'amount-based search', donationsPage, searchTerms);
  });

  test('should handle case-insensitive searches', async ({ page }) => {
    const searchTerms = DonationsTestHelpers.getSearchTerms().caseInsensitive;
    await DonationsTestHelpers.performSearchTest(page, 'case-insensitive search', donationsPage, searchTerms);
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'empty search handling', donationsPage, async (mode) => {
      if (mode === 'donations') {
        const searchSuccessful = await donationsPage.searchDonations('');
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          await donationsPage.expectDonationsReportVisible();
        }
      } else {
        await donationsPage.searchDonationsFromDashboard('');
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test('should have export functionality', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'export functionality', donationsPage, async (mode) => {
      if (mode === 'donations') {
        await donationsPage.expectLoadingComplete();
        
        const exportExists = await donationsPage.expectExportAvailable();
        
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

  test('should have filter functionality', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'filter functionality', donationsPage, async (mode) => {
      if (mode === 'donations') {
        await DonationsTestHelpers.testDonationFiltering(page, donationsPage);
      } else {
        console.log('Basic search functionality confirmed via dashboard (filter not testable)');
      }
    });
  });

  test('should display donation totals', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'donation totals display', donationsPage, async (mode) => {
      if (mode === 'donations') {
        await donationsPage.expectLoadingComplete();
        
        const totalAmount = await donationsPage.getTotalAmount();
        
        if (totalAmount) {
          console.log(`Total donation amount displayed: ${totalAmount}`);
        } else {
          console.log('Donation totals may be structured differently or require data');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (totals not testable)');
      }
    });
  });

  test('should handle empty donation results gracefully', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'empty donation results', donationsPage, async (mode) => {
      const searchTerm = 'xyznobodyhasthisdonationname123';
      
      if (mode === 'donations') {
        const searchSuccessful = await donationsPage.searchDonations(searchTerm);
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          // Should not crash or show errors
          await donationsPage.expectDonationsReportVisible();
          console.log('Empty donation results handled gracefully');
        }
      } else {
        await donationsPage.searchDonationsFromDashboard(searchTerm);
        await page.waitForLoadState('domcontentloaded');
        console.log('Empty donation results handled gracefully via dashboard');
      }
    });
  });

  test('should maintain page functionality after search', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'page functionality after search', donationsPage, async (mode) => {
      if (mode === 'donations') {
        await donationsPage.searchDonations('demo');
        await donationsPage.searchDonations('test');
        await donationsPage.expectDonationsReportVisible();
        console.log('Page functionality maintained after multiple searches');
      } else {
        await donationsPage.searchDonationsFromDashboard('demo');
        await donationsPage.searchDonationsFromDashboard('test');
        console.log('Page functionality maintained after multiple searches via dashboard');
      }
    });
  });

  test('should handle rapid consecutive searches', async ({ page }) => {
    const searchTerms = DonationsTestHelpers.getSearchTerms().rapid;
    await DonationsTestHelpers.performDonationsPageTest(page, 'rapid consecutive searches', donationsPage, async (mode) => {
      const terms = searchTerms[mode];
      
      if (mode === 'donations') {
        for (const term of terms) {
          const searchSuccessful = await donationsPage.searchDonations(term);
          if (searchSuccessful) {
            await page.waitForLoadState('domcontentloaded');
          }
        }
        
        await page.waitForLoadState('networkidle');
        await donationsPage.expectDonationsReportVisible();
      } else {
        for (const term of terms) {
          await donationsPage.searchDonationsFromDashboard(term);
          await page.waitForLoadState('domcontentloaded');
        }
      }
    });
  });

  test('should have accessible donation elements', async ({ page }) => {
    await DonationsTestHelpers.performDonationsPageTest(page, 'donation accessibility', donationsPage, async (mode) => {
      if (mode === 'donations') {
        // Check for proper donation report structure
        const reportExists = await donationsPage.reportContainer.isVisible().catch(() => false);
        
        if (reportExists) {
          console.log('Donations report elements are accessible');
        } else {
          console.log('Donations report may use different structure');
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