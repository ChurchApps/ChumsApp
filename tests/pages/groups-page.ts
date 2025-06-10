import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class GroupsPage {
  readonly page: Page;
  readonly addGroupButton: Locator;
  readonly exportLink: Locator;
  readonly groupsTable: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly firstGroupLink: Locator;
  readonly loadingIndicator: Locator;
  readonly noGroupsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addGroupButton = page.locator('button[aria-label="addGroup"], button:has-text("Add Group"), [data-testid="add-group"]');
    this.exportLink = page.locator('a:has-text("Export"), [data-testid="export-link"]');
    this.groupsTable = page.locator('table, [data-testid="groups-table"]');
    this.searchInput = page.locator('input[placeholder*="Search"], input[name*="search"], #searchText');
    this.searchButton = page.locator('button:has-text("Search"), [data-testid="search-button"]');
    this.firstGroupLink = page.locator('table tbody tr:first-child a, .group-row:first-child a').first();
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.noGroupsMessage = page.locator('text=No groups found, text=Create your first group');
  }

  async goto() {
    await this.page.goto('/groups');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to groups via menu
    const groupsNavLink = this.page.locator('a[href="/groups"], a:has-text("Groups"), nav a:has-text("Groups")').first();
    const groupsNavExists = await groupsNavLink.isVisible().catch(() => false);
    
    if (groupsNavExists) {
      await groupsNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnGroupsPage() {
    await TestHelpers.expectUrl(this.page, '/groups');
  }

  async expectGroupsTableVisible() {
    const hasTable = await this.groupsTable.isVisible().catch(() => false);
    const hasNoGroupsMessage = await this.noGroupsMessage.isVisible().catch(() => false);
    return hasTable || hasNoGroupsMessage;
  }

  async expectGroupsDisplayed() {
    await this.page.waitForLoadState('networkidle');
    return await this.expectGroupsTableVisible();
  }

  async clickAddGroup() {
    const addButtonExists = await this.addGroupButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addGroupButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickFirstGroup() {
    const firstGroupExists = await this.firstGroupLink.isVisible().catch(() => false);
    if (firstGroupExists) {
      await this.firstGroupLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async searchGroups(searchTerm: string) {
    const searchInputExists = await this.searchInput.isVisible().catch(() => false);
    
    if (searchInputExists) {
      await this.searchInput.fill(searchTerm);
      
      const searchButtonExists = await this.searchButton.isVisible().catch(() => false);
      if (searchButtonExists) {
        await this.searchButton.click();
      } else {
        await this.searchInput.press('Enter');
      }
      
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async testGroupsSearchFromDashboard() {
    // Test if groups search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for groups
      await dashboardSearchInput.fill('group');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any group-related results appear
      const hasGroupResults = await this.page.locator('text=Group, text=group').first().isVisible().catch(() => false);
      return hasGroupResults;
    }
    
    return false;
  }

  async searchGroupsFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectExportAvailable() {
    return await this.exportLink.isVisible().catch(() => false);
  }

  async expectAddGroupAvailable() {
    return await this.addGroupButton.isVisible().catch(() => false);
  }

  async getGroupsCount() {
    const rows = await this.page.locator('table tbody tr, .group-row').count();
    return rows;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }
}