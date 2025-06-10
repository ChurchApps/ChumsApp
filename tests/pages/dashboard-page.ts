import { expect, Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors
  get header() { return this.page.locator('header, .header, .app-header'); }
  get navigationMenu() { return this.page.locator('nav, .navigation, .nav-menu'); }
  get userMenu() { return this.page.locator('[data-testid="user-menu"], .user-menu, .profile-menu'); }
  get logoutButton() { return this.page.locator('button:has-text("Logout"), a:has-text("Logout")'); }
  get dashboardContent() { return this.page.locator('.dashboard, [data-testid="dashboard"], main'); }

  // Navigation links
  get peopleLink() { return this.page.locator('a[href="/people"], a:has-text("People")'); }
  get groupsLink() { return this.page.locator('a[href="/groups"], a:has-text("Groups")'); }
  get donationsLink() { return this.page.locator('a[href="/donations"], a:has-text("Donations")'); }
  get attendanceLink() { return this.page.locator('a[href="/attendance"], a:has-text("Attendance")'); }
  get settingsLink() { return this.page.locator('a[href="/settings"], a:has-text("Settings")'); }

  // Actions
  async goto() {
    await this.page.goto('/');
    await TestHelpers.waitForPageLoad(this.page);
  }

  async navigateToPeople() {
    await TestHelpers.clickAndWait(this.page, this.peopleLink.first());
  }

  async navigateToGroups() {
    await TestHelpers.clickAndWait(this.page, this.groupsLink.first());
  }

  async navigateToDonations() {
    await TestHelpers.clickAndWait(this.page, this.donationsLink.first());
  }

  async logout() {
    // Try to find and click user menu first, then logout
    const userMenuExists = await this.userMenu.first().isVisible().catch(() => false);
    if (userMenuExists) {
      await TestHelpers.clickAndWait(this.page, this.userMenu.first());
    }
    await TestHelpers.clickAndWait(this.page, this.logoutButton.first());
  }

  // Assertions
  async expectToBeOnDashboard() {
    await TestHelpers.expectUrl(this.page, '/');
    // Look for common dashboard elements
    const headerExists = await this.header.first().isVisible().catch(() => false);
    const navExists = await this.navigationMenu.first().isVisible().catch(() => false);
    const contentExists = await this.dashboardContent.first().isVisible().catch(() => false);
    
    // At least one of these should be visible on a successful dashboard load
    if (!headerExists && !navExists && !contentExists) {
      throw new Error('Dashboard elements not found - user may not be properly logged in');
    }
  }

  async expectUserIsLoggedIn() {
    // Handle church selection if it appears
    const churchSelectionDialog = this.page.locator('text=Select a Church');
    const isChurchSelectionVisible = await churchSelectionDialog.isVisible().catch(() => false);
    
    if (isChurchSelectionVisible) {
      // Click on the first church option to proceed
      const firstChurch = this.page.locator('text=Grace Community Church').first();
      await firstChurch.click();
    }
    
    // Ensure we're not on login page
    await expect(this.page).not.toHaveURL(/\/login/, { timeout: 10000 });
    
    await TestHelpers.waitForPageLoad(this.page);
  }
}