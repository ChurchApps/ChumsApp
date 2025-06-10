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
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to plans via menu
    const plansNavLink = this.page.locator('a[href="/plans"], a:has-text("Plans"), nav a:has-text("Plans")').first();
    const plansNavExists = await plansNavLink.isVisible().catch(() => false);
    
    if (plansNavExists) {
      await plansNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
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
    await this.page.waitForLoadState('networkidle');
    return await this.expectMinistriesTableVisible();
  }

  async clickFirstMinistry() {
    const firstMinistryExists = await this.firstMinistryLink.isVisible().catch(() => false);
    if (firstMinistryExists) {
      await this.firstMinistryLink.click();
      await this.page.waitForLoadState('domcontentloaded');
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
    await this.page.waitForLoadState('networkidle');
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
      
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async testPlansSearchFromDashboard() {
    // Test if plans/ministry search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for ministries/plans
      await dashboardSearchInput.fill('ministry');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any ministry-related results appear
      const hasMinistryResults = await this.page.locator('text=Ministry, text=ministry, text=Plan, text=plan').first().isVisible().catch(() => false);
      return hasMinistryResults;
    }
    
    return false;
  }

  async searchPlansFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}