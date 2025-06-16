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
    return await this.expectGroupsTableVisible();
  }

  async clickAddGroup() {
    const addButtonExists = await this.addGroupButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addGroupButton.click();
      return true;
    }
    return false;
  }

  async clickFirstGroup() {
    const firstGroupExists = await this.firstGroupLink.isVisible().catch(() => false);
    if (firstGroupExists) {
      await this.firstGroupLink.click();
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
      
      return true;
    }
    return false;
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
  }
}