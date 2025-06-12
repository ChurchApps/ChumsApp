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
    
    // Handle church selection if needed
    await TestHelpers.waitForChurchSelection(this.page);
    
    // If redirected to login, we might need to re-authenticate
    if (this.page.url().includes('/login')) {
      throw new Error('Redirected to login page - authentication may have expired');
    }
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await TestHelpers.waitForPageLoad(this.page);
    
    // Handle church selection modal if it appears
    await TestHelpers.waitForChurchSelection(this.page);

    // Click on People link in navigation
    const peopleLink = this.page.locator('a[href="/people"], a:has-text("People")').first();
    
    try {
      await peopleLink.waitFor({ timeout: 10000 });
      await TestHelpers.clickAndWait(this.page, peopleLink);
    } catch (error) {
      // Fallback to direct navigation
      await this.page.goto('/people');
      await TestHelpers.waitForPageLoad(this.page);
    }
  }

  async searchPeople(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    
    // Wait for potential API call
    const responsePromise = TestHelpers.waitForApiResponse(this.page, '/api/people').catch(() => null);
    await TestHelpers.clickAndWait(this.page, this.searchButton);
    
    // Wait for the response or timeout
    await responsePromise;
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
    await TestHelpers.expectUrl(this.page, '/people');
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    await expect(this.recentPeopleBox).toBeVisible({ timeout: 10000 });
  }

  async expectRecentPeopleDisplayed() {
    await expect(this.recentPeopleBox).toBeVisible();
  }

  async expectSearchResults() {
    // Wait for either results to appear or empty state
    try {
      await this.personRows.first().waitFor({ timeout: 10000 });
      const rowCount = await this.personRows.count();
      return rowCount > 0;
    } catch (error) {
      // No results found
      return false;
    }
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
    await TestHelpers.waitForChurchSelection(this.page);

    // Look for people search on dashboard
    const dashboardSearchInput = this.page.locator('[id="searchText"]').first();
    const dashboardSearchButton = this.page.locator('button:has-text("Search")').first();
    
    try {
      await dashboardSearchInput.waitFor({ timeout: 5000 });
      await dashboardSearchButton.waitFor({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async searchPeopleFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('[id="searchText"]').first();
    const dashboardSearchButton = this.page.locator('button:has-text("Search")').first();
    
    await dashboardSearchInput.fill(searchTerm);
    
    // Wait for potential API call
    const responsePromise = TestHelpers.waitForApiResponse(this.page, '/api/people').catch(() => null);
    await TestHelpers.clickAndWait(this.page, dashboardSearchButton);
    
    // Wait for the response or timeout
    await responsePromise;
  }

  async searchPeopleFromDashboardRapid(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('[id="searchText"]').first();
    const dashboardSearchButton = this.page.locator('button:has-text("Search")').first();
    
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchButton.click();
    
    // Wait for the form to submit
    await TestHelpers.waitForPageLoad(this.page);
  }
}