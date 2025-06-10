import { expect, Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class PeoplePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors
  get pageTitle() { return this.page.locator('h1'); }
  get recentPeopleBox() { return this.page.locator('[id="peopleBox"]'); }
  get exportLink() { return this.page.locator('text=Export'); }
  get columnsButton() { return this.page.locator('button:has-text("Columns")'); }
  
  // Search components
  get simpleSearchBox() { return this.page.locator('.MuiBox-root', { has: this.page.locator('text=Simple Search') }); }
  get searchInput() { return this.page.locator('[id="searchText"]'); }
  get searchButton() { return this.page.locator('button:has-text("Search")'); }
  get advancedButton() { return this.page.locator('button:has-text("Advanced")'); }
  
  // Results
  get searchResults() { return this.page.locator('.people-results, [data-testid="people-results"]'); }
  get personRows() { return this.page.locator('tbody tr, .person-row'); }
  get firstPersonLink() { return this.page.locator('tbody tr a, .person-link').first(); }

  // Actions
  async goto() {
    await this.page.goto('/people');
    await TestHelpers.waitForPageLoad(this.page);
    
    // Wait for potential redirects and ensure we're not on login page
    await this.page.waitForTimeout(2000);
    
    // If redirected to login, we might need to re-authenticate
    if (this.page.url().includes('/login')) {
      throw new Error('Redirected to login page - authentication may have expired');
    }
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await TestHelpers.waitForPageLoad(this.page);
    await this.page.waitForTimeout(1000);
    
    // Handle church selection modal if it appears
    const churchSelectionDialog = this.page.locator('text=Select a Church');
    const isChurchSelectionVisible = await churchSelectionDialog.isVisible().catch(() => false);
    
    if (isChurchSelectionVisible) {
      const graceChurch = this.page.locator('text=Grace Community Church').first();
      await graceChurch.click();
      await this.page.waitForTimeout(2000);
    }

    // Click on People link in navigation
    const peopleLink = this.page.locator('a[href="/people"], a:has-text("People")').first();
    const linkExists = await peopleLink.isVisible().catch(() => false);
    
    if (linkExists) {
      await TestHelpers.clickAndWait(this.page, peopleLink);
    } else {
      // Fallback to direct navigation
      await this.page.goto('/people');
      await TestHelpers.waitForPageLoad(this.page);
    }
  }

  async searchPeople(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await TestHelpers.clickAndWait(this.page, this.searchButton);
    await TestHelpers.waitForPageLoad(this.page);
  }

  async clickAdvancedSearch() {
    await TestHelpers.clickAndWait(this.page, this.advancedButton);
  }

  async exportPeople() {
    const exportLinkExists = await this.exportLink.isVisible().catch(() => false);
    if (exportLinkExists) {
      await TestHelpers.clickAndWait(this.page, this.exportLink);
    }
  }

  async openColumnsSelector() {
    const columnsButtonExists = await this.columnsButton.isVisible().catch(() => false);
    if (columnsButtonExists) {
      await TestHelpers.clickAndWait(this.page, this.columnsButton);
    }
  }

  async clickFirstPerson() {
    const firstPersonExists = await this.firstPersonLink.isVisible().catch(() => false);
    if (firstPersonExists) {
      await TestHelpers.clickAndWait(this.page, this.firstPersonLink);
    }
    return firstPersonExists;
  }

  // Assertions
  async expectToBeOnPeoplePage() {
    // Check if we're on the people page or if we were redirected to login
    const currentUrl = this.page.url();
    if (currentUrl.includes('/login')) {
      throw new Error(`Expected to be on people page but was redirected to login: ${currentUrl}`);
    }
    
    await TestHelpers.expectUrl(this.page, '/people');
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    await expect(this.recentPeopleBox).toBeVisible({ timeout: 10000 });
  }

  async expectRecentPeopleDisplayed() {
    await expect(this.recentPeopleBox).toBeVisible();
  }

  async expectSearchResults() {
    // Wait for results to load
    await this.page.waitForTimeout(2000);
    
    // Check if there are person rows in the results
    const rowCount = await this.personRows.count();
    return rowCount > 0;
  }

  async expectSimpleSearchVisible() {
    await expect(this.simpleSearchBox).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  // Fallback method to test people search from dashboard
  async testPeopleSearchFromDashboard() {
    await this.page.goto('/');
    await TestHelpers.waitForPageLoad(this.page);
    
    // Handle church selection modal if it appears
    const churchSelectionDialog = this.page.locator('text=Select a Church');
    const isChurchSelectionVisible = await churchSelectionDialog.isVisible().catch(() => false);
    
    if (isChurchSelectionVisible) {
      const graceChurch = this.page.locator('text=Grace Community Church').first();
      await graceChurch.click();
      await this.page.waitForTimeout(2000);
    }

    // Look for people search on dashboard
    const dashboardSearchInput = this.page.locator('[id="searchText"]').first();
    const dashboardSearchButton = this.page.locator('button:has-text("Search")').first();
    
    const hasSearchInput = await dashboardSearchInput.isVisible().catch(() => false);
    const hasSearchButton = await dashboardSearchButton.isVisible().catch(() => false);
    
    return hasSearchInput && hasSearchButton;
  }

  async searchPeopleFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('[id="searchText"]').first();
    const dashboardSearchButton = this.page.locator('button:has-text("Search")').first();
    
    await dashboardSearchInput.fill(searchTerm);
    await TestHelpers.clickAndWait(this.page, dashboardSearchButton);
    // Use shorter wait for rapid searches to avoid timeout
    await this.page.waitForTimeout(1000);
  }

  async searchPeopleFromDashboardRapid(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('[id="searchText"]').first();
    const dashboardSearchButton = this.page.locator('button:has-text("Search")').first();
    
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchButton.click();
    // Very short wait for rapid consecutive searches
    await this.page.waitForTimeout(300);
  }
}