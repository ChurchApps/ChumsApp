import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class AttendancePage {
  readonly page: Page;
  readonly setupTab: Locator;
  readonly attendanceTrendTab: Locator;
  readonly groupAttendanceTab: Locator;
  readonly addButton: Locator;
  readonly addCampusMenuItem: Locator;
  readonly addServiceMenuItem: Locator;
  readonly addServiceTimeMenuItem: Locator;
  readonly attendanceTable: Locator;
  readonly attendanceGroups: Locator;
  readonly loadingIndicator: Locator;
  readonly emptyStateMessage: Locator;
  readonly sideNav: Locator;
  readonly mainContent: Locator;
  readonly campusRows: Locator;
  readonly serviceRows: Locator;
  readonly serviceTimeRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.setupTab = page.locator('.sideNav a:has-text("Setup"), [role="tab"]:has-text("Setup")');
    this.attendanceTrendTab = page.locator('.sideNav a:has-text("Attendance Trend"), [role="tab"]:has-text("Attendance Trend")');
    this.groupAttendanceTab = page.locator('.sideNav a:has-text("Group Attendance"), [role="tab"]:has-text("Group Attendance")');
    this.addButton = page.locator('[data-cy="add-button"], #addBtnGroup, button:has-text("Add")');
    this.addCampusMenuItem = page.locator('[data-cy="add-campus"], text=Add Campus');
    this.addServiceMenuItem = page.locator('[data-cy="add-service"], text=Add Service');
    this.addServiceTimeMenuItem = page.locator('[data-cy="add-service-time"], text=Add Service Time');
    this.attendanceTable = page.locator('table, [data-testid="attendance-table"]');
    this.attendanceGroups = page.locator('[data-cy="attendance-groups"], .attendance-groups');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.emptyStateMessage = page.locator('text=No attendance records, text=Create group sessions, text=empty');
    this.sideNav = page.locator('.sideNav');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.campusRows = page.locator('tbody tr, .campus-row');
    this.serviceRows = page.locator('tbody tr, .service-row');
    this.serviceTimeRows = page.locator('tbody tr, .service-time-row');
  }

  async goto() {
    await this.page.goto('/attendance');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to attendance via menu
    const attendanceNavLink = this.page.locator('a[href="/attendance"], a:has-text("Attendance"), nav a:has-text("Attendance")').first();
    const attendanceNavExists = await attendanceNavLink.isVisible().catch(() => false);
    
    if (attendanceNavExists) {
      await attendanceNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnAttendancePage() {
    await TestHelpers.expectUrl(this.page, '/attendance');
  }

  async expectSideNavVisible() {
    const hasSideNav = await this.sideNav.isVisible().catch(() => false);
    const hasTabNav = await this.page.locator('[role="tab"], .tab').first().isVisible().catch(() => false);
    return hasSideNav || hasTabNav;
  }

  async clickSetupTab() {
    const setupTabExists = await this.setupTab.isVisible().catch(() => false);
    if (setupTabExists) {
      await this.setupTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickAttendanceTrendTab() {
    const trendTabExists = await this.attendanceTrendTab.isVisible().catch(() => false);
    if (trendTabExists) {
      await this.attendanceTrendTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickGroupAttendanceTab() {
    const groupTabExists = await this.groupAttendanceTab.isVisible().catch(() => false);
    if (groupTabExists) {
      await this.groupAttendanceTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectAttendanceTableVisible() {
    const hasTable = await this.attendanceTable.isVisible().catch(() => false);
    const hasAttendanceGroups = await this.attendanceGroups.isVisible().catch(() => false);
    const hasEmptyMessage = await this.emptyStateMessage.isVisible().catch(() => false);
    return hasTable || hasAttendanceGroups || hasEmptyMessage;
  }

  async expectAttendanceDisplayed() {
    await this.page.waitForLoadState('networkidle');
    return await this.expectAttendanceTableVisible();
  }

  async clickAddButton() {
    const addButtonExists = await this.addButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickAddCampus() {
    const addClicked = await this.clickAddButton();
    if (addClicked) {
      const addCampusExists = await this.addCampusMenuItem.isVisible().catch(() => false);
      if (addCampusExists) {
        await this.addCampusMenuItem.click();
        await this.page.waitForLoadState('domcontentloaded');
        return true;
      }
    }
    return false;
  }

  async clickAddService() {
    const addClicked = await this.clickAddButton();
    if (addClicked) {
      const addServiceExists = await this.addServiceMenuItem.isVisible().catch(() => false);
      if (addServiceExists) {
        await this.addServiceMenuItem.click();
        await this.page.waitForLoadState('domcontentloaded');
        return true;
      }
    }
    return false;
  }

  async clickAddServiceTime() {
    const addClicked = await this.clickAddButton();
    if (addClicked) {
      const addServiceTimeExists = await this.addServiceTimeMenuItem.isVisible().catch(() => false);
      if (addServiceTimeExists) {
        await this.addServiceTimeMenuItem.click();
        await this.page.waitForLoadState('domcontentloaded');
        return true;
      }
    }
    return false;
  }

  async getCampusCount() {
    const rows = await this.campusRows.count();
    return rows;
  }

  async getServiceCount() {
    const rows = await this.serviceRows.count();
    return rows;
  }

  async getServiceTimeCount() {
    const rows = await this.serviceTimeRows.count();
    return rows;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async editFirstCampus() {
    // Look for first campus name link to edit
    const campusLink = this.page.locator('tbody tr td a, .campus-name a').first();
    const campusLinkExists = await campusLink.isVisible().catch(() => false);
    
    if (campusLinkExists) {
      await campusLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async editFirstService() {
    // Look for first service name link to edit
    const serviceLink = this.page.locator('tbody tr td a, .service-name a').first();
    const serviceLinkExists = await serviceLink.isVisible().catch(() => false);
    
    if (serviceLinkExists) {
      await serviceLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async editFirstServiceTime() {
    // Look for first service time name link to edit
    const serviceTimeLink = this.page.locator('tbody tr td a, .service-time-name a').first();
    const serviceTimeLinkExists = await serviceTimeLink.isVisible().catch(() => false);
    
    if (serviceTimeLinkExists) {
      await serviceTimeLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async testAttendanceSearchFromDashboard() {
    // Test if attendance search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for attendance-related terms
      await dashboardSearchInput.fill('attendance');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any attendance-related results appear
      const hasAttendanceResults = await this.page.locator('text=Attendance, text=attendance, text=Campus, text=campus').first().isVisible().catch(() => false);
      return hasAttendanceResults;
    }
    
    return false;
  }

  async searchAttendanceFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}