import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class FundsPage {
  readonly page: Page;
  readonly fundsTable: Locator;
  readonly addFundButton: Locator;
  readonly exportButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly firstFundLink: Locator;
  readonly fundRows: Locator;
  readonly loadingIndicator: Locator;
  readonly noFundsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fundsTable = page.locator('table, [data-testid="funds-table"]');
    this.addFundButton = page.locator('button:has-text("Add Fund"), [data-testid="add-fund"]');
    this.exportButton = page.locator('button:has-text("Export"), a:has-text("Export"), [data-testid="export-button"]');
    this.searchInput = page.locator('input[placeholder*="Search"], input[name*="search"]');
    this.searchButton = page.locator('button:has-text("Search"), [data-testid="search-button"]');
    this.firstFundLink = page.locator('table tbody tr:first-child a, .fund-row:first-child a').first();
    this.fundRows = page.locator('tbody tr, .fund-row');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.noFundsMessage = page.locator('text=No funds found, text=Create your first fund');
  }

  async goto() {
    await this.page.goto('/donations/funds');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to funds via menu
    const fundsNavLink = this.page.locator('a[href="/donations/funds"], a:has-text("Funds")').first();
    const fundsNavExists = await fundsNavLink.isVisible().catch(() => false);
    
    if (fundsNavExists) {
      await fundsNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnFundsPage() {
    await TestHelpers.expectUrl(this.page, '/donations/funds');
  }

  async expectFundsTableVisible() {
    const hasTable = await this.fundsTable.isVisible().catch(() => false);
    const hasNoFundsMessage = await this.noFundsMessage.isVisible().catch(() => false);
    return hasTable || hasNoFundsMessage;
  }

  async expectFundsDisplayed() {
    await this.page.waitForLoadState('networkidle');
    return await this.expectFundsTableVisible();
  }

  async clickAddFund() {
    const addButtonExists = await this.addFundButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addFundButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickFirstFund() {
    const firstFundExists = await this.firstFundLink.isVisible().catch(() => false);
    if (firstFundExists) {
      await this.firstFundLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async searchFunds(searchTerm: string) {
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

  async expectExportAvailable() {
    return await this.exportButton.isVisible().catch(() => false);
  }

  async expectAddFundAvailable() {
    return await this.addFundButton.isVisible().catch(() => false);
  }

  async getFundsCount() {
    const rows = await this.fundRows.count();
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