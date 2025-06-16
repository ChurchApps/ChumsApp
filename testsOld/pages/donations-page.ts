import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class DonationsPage {
  readonly page: Page;
  readonly reportContainer: Locator;
  readonly donationsList: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterButton: Locator;
  readonly exportButton: Locator;
  readonly addDonationButton: Locator;
  readonly donationRows: Locator;
  readonly totalAmount: Locator;
  readonly dateFilter: Locator;
  readonly fundFilter: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reportContainer = page.locator('#mainContent, .report-container, [data-testid="donations-report"]');
    this.donationsList = page.locator('table, .donations-list, [data-testid="donations-list"]');
    this.searchInput = page.locator('input[placeholder*="Search"], input[name*="search"], #searchText');
    this.searchButton = page.locator('button:has-text("Search"), [data-testid="search-button"]');
    this.filterButton = page.locator('button:has-text("Filter"), [data-testid="filter-button"]');
    this.exportButton = page.locator('button:has-text("Export"), a:has-text("Export"), [data-testid="export-button"]');
    this.addDonationButton = page.locator('button:has-text("Add Donation"), [data-testid="add-donation"]');
    this.donationRows = page.locator('tbody tr, .donation-row');
    this.totalAmount = page.locator('.total-amount, [data-testid="total-amount"]');
    this.dateFilter = page.locator('input[type="date"], [data-testid="date-filter"]');
    this.fundFilter = page.locator('select[name*="fund"], [data-testid="fund-filter"]');
    this.loadingIndicator = page.locator('.loading, text=Loading');
  }

  async goto() {
    await this.page.goto('/donations');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to donations via menu
    const donationsNavLink = this.page.locator('a[href="/donations"], a:has-text("Donations"), nav a:has-text("Donations")').first();
    const donationsNavExists = await donationsNavLink.isVisible().catch(() => false);
    
    if (donationsNavExists) {
      await donationsNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnDonationsPage() {
    await TestHelpers.expectUrl(this.page, '/donations');
  }

  async expectDonationsReportVisible() {
    const hasReport = await this.reportContainer.isVisible().catch(() => false);
    const hasList = await this.donationsList.isVisible().catch(() => false);
    return hasReport || hasList;
  }

  async expectDonationsDisplayed() {
    await this.page.waitForLoadState('networkidle');
    return await this.expectDonationsReportVisible();
  }

  async searchDonations(searchTerm: string) {
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

  async testDonationsSearchFromDashboard() {
    // Test if donations search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for donations
      await dashboardSearchInput.fill('donation');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any donation-related results appear
      const hasDonationResults = await this.page.locator('text=Donation, text=donation, text=Fund, text=fund').first().isVisible().catch(() => false);
      return hasDonationResults;
    }
    
    return false;
  }

  async searchDonationsFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectExportAvailable() {
    return await this.exportButton.isVisible().catch(() => false);
  }

  async expectFilterAvailable() {
    return await this.filterButton.isVisible().catch(() => false);
  }

  async clickFilter() {
    const filterButtonExists = await this.filterButton.isVisible().catch(() => false);
    if (filterButtonExists) {
      await this.filterButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async getDonationsCount() {
    const rows = await this.donationRows.count();
    return rows;
  }

  async getTotalAmount() {
    const totalAmountExists = await this.totalAmount.isVisible().catch(() => false);
    if (totalAmountExists) {
      return await this.totalAmount.textContent();
    }
    return null;
  }
}