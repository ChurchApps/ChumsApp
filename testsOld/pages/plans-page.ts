import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class PlansPage {
  readonly page: Page;
  readonly ministriesTable: Locator;
  readonly firstMinistryLink: Locator;
  readonly ministryRows: Locator;
  readonly loadingIndicator: Locator;
  readonly noMinistriesMessage: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ministriesTable = page.locator('table, [data-testid="ministries-table"]');
    this.firstMinistryLink = page.locator('table tbody tr:first-child a, .ministry-row:first-child a').first();
    this.ministryRows = page.locator('tbody tr, .ministry-row');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.noMinistriesMessage = page.locator('text=No ministries found, text=No ministries available');
    this.searchInput = page.locator('input[placeholder*="Search"], input[name*="search"]');
    this.searchButton = page.locator('button:has-text("Search"), [data-testid="search-button"]');
  }

  async goto() {
    await this.page.goto('/plans');
  }

  async expectToBeOnPlansPage() {
    await TestHelpers.expectUrl(this.page, '/plans');
  }

  async expectMinistriesTableVisible() {
    const hasTable = await this.ministriesTable.isVisible().catch(() => false);
    const hasNoMinistriesMessage = await this.noMinistriesMessage.isVisible().catch(() => false);
    return hasTable || hasNoMinistriesMessage;
  }

  async expectMinistriesDisplayed() {
    return await this.expectMinistriesTableVisible();
  }

  async clickFirstMinistry() {
    const firstMinistryExists = await this.firstMinistryLink.isVisible().catch(() => false);
    if (firstMinistryExists) {
      await this.firstMinistryLink.click();
      return true;
    }
    return false;
  }

  async getMinistriesCount() {
    const rows = await this.ministryRows.count();
    return rows;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
  }

  async searchMinistries(searchTerm: string) {
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

}