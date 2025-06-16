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
  get dashboardContent() { return this.page.locator('.dashboard, [data-testid="dashboard"], main, #mainContent'); }
  
  // Dashboard specific elements
  get dashboardTitle() { return this.page.locator('h1:has-text("Chums")'); }
  get peopleSearchBox() { return this.page.locator('[id="peopleBox"]'); }
  get searchInput() { return this.page.locator('[id="searchText"]'); }
  get searchButton() { return this.page.locator('button:has-text("Search")'); }
  get taskList() { return this.page.locator('text=Tasks'); }

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

  async searchPeople(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await TestHelpers.clickAndWait(this.page, this.searchButton);
    await TestHelpers.waitForPageLoad(this.page);
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
    // Look for dashboard-specific elements
    await expect(this.dashboardTitle.first()).toBeVisible({ timeout: 10000 });
    await expect(this.peopleSearchBox.first()).toBeVisible({ timeout: 10000 });
  }

  async expectDashboardComponents() {
    await expect(this.dashboardTitle).toBeVisible();
    await expect(this.peopleSearchBox).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async expectUserIsLoggedIn() {
    // Handle church selection if it appears
    const churchSelectionDialog = this.page.locator('text=Select a Church');
    const isChurchSelectionVisible = await churchSelectionDialog.isVisible().catch(() => false);
    
    if (isChurchSelectionVisible) {
      // Click on the first church option to proceed
      const firstChurch = this.page.locator('text=Grace Community Church').first();
      await firstChurch.click();
      // Wait for church selection to complete
      await this.page.waitForTimeout(2000);
    }
    
    // Ensure we're not on login page
    await expect(this.page).not.toHaveURL(/\/login/, { timeout: 10000 });
    
    // Use a more lenient wait approach
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (error) {
      // If networkidle fails, just wait for basic load state
      await this.page.waitForLoadState('load', { timeout: 5000 });
    }
  }
}