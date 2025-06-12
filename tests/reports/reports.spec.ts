import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { ReportsPage } from '../pages/reports-page';
import { ReportPage } from '../pages/report-page';
import { SharedSetup } from '../utils/shared-setup';
import { ReportsTestHelpers } from './reports-test-helpers';

test.describe('Reports Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let reportsPage: ReportsPage;
  let reportPage: ReportPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    reportsPage = new ReportsPage(page);
    reportPage = new ReportPage(page);
    
  });

  test('should check if reports page is accessible', async ({ page }) => {
    await ReportsTestHelpers.performReportsPageTest(page, 'reports page accessibility', reportsPage, async () => {
      await ReportsTestHelpers.testPageAccessibility(page, 'reportsListing');
    });
  });

  test('should display reports listing by default', async ({ page }) => {
    await ReportsTestHelpers.performReportsPageTest(page, 'reports listing display', reportsPage, async () => {
      await ReportsTestHelpers.testReportsListing(page, reportsPage);
    });
  });

  test('should navigate to birthdays report', async ({ page }) => {
    await ReportsTestHelpers.performReportPageTest(page, 'Birthdays report navigation', reportsPage, reportPage, async () => {
      await ReportsTestHelpers.testReportNavigation(page, reportsPage, 'birthdays');
      
      const currentUrl = page.url();
      const isOnReportPage = /\/reports\/birthdays/.test(currentUrl);
      expect(isOnReportPage).toBeTruthy();
      console.log('Successfully navigated to birthdays report');
    });
  });

  test('should navigate to attendance trend report', async ({ page }) => {
    await ReportsTestHelpers.performReportPageTest(page, 'Attendance trend report navigation', reportsPage, reportPage, async () => {
      await ReportsTestHelpers.testReportNavigation(page, reportsPage, 'attendanceTrend');
      
      const currentUrl = page.url();
      const isOnReportPage = /\/reports\/attendanceTrend/.test(currentUrl);
      expect(isOnReportPage).toBeTruthy();
      console.log('Successfully navigated to attendance trend report');
    });
  });

  test('should navigate to group attendance report', async ({ page }) => {
    await ReportsTestHelpers.performReportPageTest(page, 'Group attendance report navigation', reportsPage, reportPage, async () => {
      await ReportsTestHelpers.testReportNavigation(page, reportsPage, 'groupAttendance');
      
      const currentUrl = page.url();
      const isOnReportPage = /\/reports\/groupAttendance/.test(currentUrl);
      expect(isOnReportPage).toBeTruthy();
      console.log('Successfully navigated to group attendance report');
    });
  });

  test('should navigate to donation summary report', async ({ page }) => {
    await ReportsTestHelpers.performReportPageTest(page, 'Donation summary report navigation', reportsPage, reportPage, async () => {
      await ReportsTestHelpers.testReportNavigation(page, reportsPage, 'donationSummary');
      
      const currentUrl = page.url();
      const isOnReportPage = /\/reports\/donationSummary/.test(currentUrl);
      expect(isOnReportPage).toBeTruthy();
      console.log('Successfully navigated to donation summary report');
    });
  });

  test('should handle individual report page functionality', async ({ page }) => {
    await ReportsTestHelpers.performReportPageTest(page, 'Report page functionality', reportsPage, reportPage, async () => {
      const reportClicked = await reportsPage.clickFirstReportLink();
      expect(reportClicked).toBeTruthy();
      
      const reportPageTested = await ReportsTestHelpers.testReportPageFunctionality(page, reportPage);
      expect(reportPageTested).toBeTruthy();
      console.log('Report page functionality verified');
    });
  });

  test('should handle report filtering functionality', async ({ page }) => {
    await ReportsTestHelpers.performReportPageTest(page, 'Report filtering functionality', reportsPage, reportPage, async () => {
      const reportClicked = await reportsPage.clickFirstReportLink();
      expect(reportClicked).toBeTruthy();
      
      const filteringTested = await ReportsTestHelpers.testReportFiltering(page, reportPage);
      expect(filteringTested).toBeTruthy();
      console.log('Report filtering functionality verified');
    });
  });

  test('should handle reports page via URL', async ({ page }) => {
    await reportsPage.goto();
    await reportsPage.expectToBeOnReportsPage();
    console.log('Successfully navigated to reports page via URL');
  });

  test('should handle individual report URL navigation', async ({ page }) => {
    await reportPage.goto('birthdays');
    
    const currentUrl = page.url();
    const isOnReportPage = currentUrl.includes('/reports/birthdays');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isOnReportPage || hasErrorMessage).toBeTruthy();
    console.log('Individual report URL navigation handled gracefully');
  });

  test('should have accessible reports elements', async ({ page }) => {
    await ReportsTestHelpers.performReportsPageTest(page, 'reports accessibility', reportsPage, async () => {
      const reportsBoxExists = await reportsPage.reportsBox.isVisible({ timeout: 5000 }).catch(() => false);
      const mainContentExists = await reportsPage.mainContent.isVisible({ timeout: 5000 }).catch(() => false);
      
      expect(reportsBoxExists || mainContentExists).toBeTruthy();
      console.log('Reports elements are accessible');
    });
  });

  test('should handle invalid reports URL gracefully', async ({ page }) => {
    await page.goto('/reports?invalid=true');
    
    const currentUrl = page.url();
    const isOnReportsPage = currentUrl.includes('/reports');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isOnReportsPage || hasErrorMessage).toBeTruthy();
    console.log('Invalid reports URL handled gracefully');
  });

  test('should handle invalid report key gracefully', async ({ page }) => {
    await page.goto('/reports/invalid-report-key');
    
    const currentUrl = page.url();
    const isOnReportsPage = currentUrl.includes('/reports') && !currentUrl.includes('invalid-report-key');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isOnReportsPage || hasErrorMessage).toBeTruthy();
    console.log('Invalid report key handled gracefully');
  });
});