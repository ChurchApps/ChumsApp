import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class ReportsPage {
  readonly page: Page;
  readonly reportsBox: Locator;
  readonly birthdaysLink: Locator;
  readonly attendanceTrendLink: Locator;
  readonly groupAttendanceLink: Locator;
  readonly dailyGroupAttendanceLink: Locator;
  readonly donationSummaryLink: Locator;
  readonly reportLinks: Locator;
  readonly loadingIndicator: Locator;
  readonly mainContent: Locator;
  readonly reportsTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reportsBox = page.locator('#reportsBox, [data-testid="reports-box"]');
    this.birthdaysLink = page.locator('a[href="/reports/birthdays"], a:has-text("Birthdays")');
    this.attendanceTrendLink = page.locator('a[href="/reports/attendanceTrend"], a:has-text("Attendance Trend")');
    this.groupAttendanceLink = page.locator('a[href="/reports/groupAttendance"], a:has-text("Group Attendance")');
    this.dailyGroupAttendanceLink = page.locator('a[href="/reports/dailyGroupAttendance"], a:has-text("Daily Group Attendance")');
    this.donationSummaryLink = page.locator('a[href="/reports/donationSummary"], a:has-text("Donation Summary")');
    this.reportLinks = page.locator('a[href^="/reports/"]');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.reportsTitle = page.locator('h1:has-text("Reports"), h1:has-text("reports")');
  }

  async goto() {
    await this.page.goto('/reports');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to reports via menu
    const reportsNavLink = this.page.locator('a[href="/reports"], a:has-text("Reports"), nav a:has-text("Reports")').first();
    const reportsNavExists = await reportsNavLink.isVisible().catch(() => false);
    
    if (reportsNavExists) {
      await reportsNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnReportsPage() {
    await TestHelpers.expectUrl(this.page, '/reports');
  }

  async expectReportsBoxVisible() {
    const hasBox = await this.reportsBox.isVisible().catch(() => false);
    const hasTitle = await this.reportsTitle.isVisible().catch(() => false);
    return hasBox || hasTitle;
  }

  async expectReportsDisplayed() {
    await this.page.waitForLoadState('networkidle');
    return await this.expectReportsBoxVisible();
  }

  async clickBirthdaysReport() {
    const linkExists = await this.birthdaysLink.isVisible().catch(() => false);
    if (linkExists) {
      await this.birthdaysLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickAttendanceTrendReport() {
    const linkExists = await this.attendanceTrendLink.isVisible().catch(() => false);
    if (linkExists) {
      await this.attendanceTrendLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickGroupAttendanceReport() {
    const linkExists = await this.groupAttendanceLink.isVisible().catch(() => false);
    if (linkExists) {
      await this.groupAttendanceLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickDailyGroupAttendanceReport() {
    const linkExists = await this.dailyGroupAttendanceLink.isVisible().catch(() => false);
    if (linkExists) {
      await this.dailyGroupAttendanceLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickDonationSummaryReport() {
    const linkExists = await this.donationSummaryLink.isVisible().catch(() => false);
    if (linkExists) {
      await this.donationSummaryLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async getReportLinksCount() {
    const count = await this.reportLinks.count();
    return count;
  }

  async clickFirstReportLink() {
    const firstLinkExists = await this.reportLinks.first().isVisible().catch(() => false);
    if (firstLinkExists) {
      await this.reportLinks.first().click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async testReportsSearchFromDashboard() {
    // Test if reports search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for report-related terms
      await dashboardSearchInput.fill('report');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any report-related results appear
      const hasReportResults = await this.page.locator('text=Report, text=report, text=Birthday, text=birthday').first().isVisible().catch(() => false);
      return hasReportResults;
    }
    
    return false;
  }

  async searchReportsFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}