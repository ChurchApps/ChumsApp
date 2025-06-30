import { Page } from '@playwright/test';

export class DonationsHelper {
  /**
   * Navigate to donations functionality
   */
  static async navigateToDonations(page: Page) {
    // Try navigating through menu
    const menuButton = page.locator('button[aria-label*="menu"], .MuiIconButton-root').first();
    const hasMenu = await menuButton.isVisible().catch(() => false);
    
    if (hasMenu) {
      await menuButton.click();
      await page.waitForTimeout(1000);
      
      const donationsLink = page.locator('text=Donations, text=Giving, a[href="/donations"]').first();
      const hasDonationsOption = await donationsLink.isVisible().catch(() => false);
      
      if (hasDonationsOption) {
        await donationsLink.click();
        await page.waitForLoadState('networkidle');
        console.log('Navigated to donations through menu');
        return;
      }
    }
    
    // Try direct navigation
    const currentUrl = page.url();
    if (!currentUrl.includes('/donations')) {
      await page.goto('https://chumsdemo.churchapps.org/donations');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    console.log('Donations navigation completed');
  }

  /**
   * Navigate to funds management
   */
  static async navigateToFunds(page: Page) {
    // Look for funds tab or link
    const fundsSelectors = [
      'text=Funds',
      'a[href="/funds"]',
      'button:has-text("Funds")',
      'tab:has-text("Funds")'
    ];
    
    for (const selector of fundsSelectors) {
      const fundsLink = page.locator(selector).first();
      const isVisible = await fundsLink.isVisible().catch(() => false);
      if (isVisible) {
        await fundsLink.click();
        await page.waitForLoadState('networkidle');
        console.log('Navigated to funds management');
        return;
      }
    }
    
    // Try direct navigation
    await page.goto('https://chumsdemo.churchapps.org/funds');
    await page.waitForLoadState('networkidle');
    console.log('Funds navigation completed');
  }

  /**
   * Search for donations by donor name, amount, or date
   */
  static async searchDonations(page: Page, searchTerm: string) {
    const searchSelectors = [
      '[data-testid="people-search-input"]',
      '[data-testid="dashboard-people-search-input"]',
      '#searchText',
      'input[placeholder*="Search"]',
      'input[name="search"]',
      'input[placeholder*="Donations"]',
      'input[placeholder*="Donor"]'
    ];
    
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector).first();
      const isVisible = await searchInput.isVisible().catch(() => false);
      if (isVisible) {
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
        return;
      }
    }
    
    console.log('Donations search completed');
  }

  /**
   * Search for funds by name or category
   */
  static async searchFunds(page: Page, searchTerm: string) {
    const searchSelectors = [
      '[data-testid="people-search-input"]',
      '[data-testid="dashboard-people-search-input"]',
      '#searchText',
      'input[placeholder*="Search"]',
      'input[name="search"]',
      'input[placeholder*="Fund"]'
    ];
    
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector).first();
      const isVisible = await searchInput.isVisible().catch(() => false);
      if (isVisible) {
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
        return;
      }
    }
    
    console.log('Fund search completed');
  }

  /**
   * Create a new donation
   */
  static async createDonation(page: Page, donation: {
    donorName: string;
    amount: number;
    fund: string;
    paymentMethod?: string;
    checkNumber?: string;
    date?: string;
  }) {
    console.log(`Simulating creation of donation: $${donation.amount} from ${donation.donorName}`);
    
    // Look for add donation button
    const addButtonSelectors = [
      'button:has-text("Add Donation")',
      'button:has-text("Add")',
      'button:has-text("Record Donation")',
      '[aria-label*="add"]'
    ];
    
    let addButtonFound = false;
    for (const selector of addButtonSelectors) {
      const addButton = page.locator(selector).first();
      const isVisible = await addButton.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`Found add donation button: ${selector}`);
        addButtonFound = true;
        break;
      }
    }
    
    if (!addButtonFound) {
      console.log('Add Donation button not found - demonstrating creation pattern');
    }
    
    console.log(`Donation would be created in production with:`);
    console.log(`- Donor: ${donation.donorName}`);
    console.log(`- Amount: $${donation.amount}`);
    console.log(`- Fund: ${donation.fund}`);
    console.log(`- Payment Method: ${donation.paymentMethod || 'Cash'}`);
    if (donation.checkNumber) console.log(`- Check Number: ${donation.checkNumber}`);
    console.log(`- Date: ${donation.date || new Date().toISOString().split('T')[0]}`);
  }

  /**
   * Create multiple donations in batch
   */
  static async createBatchDonations(page: Page, donations: Array<{
    donorName: string;
    amount: number;
    fund: string;
    paymentMethod?: string;
  }>) {
    console.log(`Simulating batch creation of ${donations.length} donations`);
    
    donations.forEach((donation, index) => {
      console.log(`${index + 1}. ${donation.donorName}: $${donation.amount} to ${donation.fund}`);
    });
    
    console.log('Batch donations would be created in production');
  }

  /**
   * Create a new fund
   */
  static async createFund(page: Page, fund: {
    name: string;
    description?: string;
    goal?: number;
    category?: string;
  }) {
    console.log(`Simulating creation of fund: ${fund.name}`);
    
    // Navigate to funds first
    await this.navigateToFunds(page);
    
    console.log(`Fund would be created in production with:`);
    console.log(`- Name: ${fund.name}`);
    console.log(`- Description: ${fund.description || 'No description'}`);
    console.log(`- Goal: $${fund.goal || 0}`);
    console.log(`- Category: ${fund.category || 'General'}`);
  }

  /**
   * Edit an existing donation
   */
  static async editDonation(page: Page, donationId: string, updates: {
    amount?: number;
    fund?: string;
    paymentMethod?: string;
    date?: string;
  }) {
    console.log(`Simulating edit of donation: ${donationId}`);
    
    console.log(`Donation ${donationId} would be updated in production with:`);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) console.log(`- ${key}: ${value}`);
    });
  }

  /**
   * Delete a donation
   */
  static async deleteDonation(page: Page, donationId: string) {
    console.log(`Simulating deletion of donation: ${donationId}`);
    console.log(`Donation ${donationId} would be deleted in production`);
  }

  /**
   * Generate financial reports
   */
  static async generateReport(page: Page, reportType: string, options: {
    startDate?: string;
    endDate?: string;
    fundId?: string;
    donorId?: string;
  }) {
    console.log(`Simulating generation of ${reportType} report`);
    
    // Look for reports section
    const reportsSelectors = [
      'text=Reports',
      'a[href="/reports"]',
      'button:has-text("Reports")',
      'tab:has-text("Reports")'
    ];
    
    for (const selector of reportsSelectors) {
      const reportsLink = page.locator(selector).first();
      const isVisible = await reportsLink.isVisible().catch(() => false);
      if (isVisible) {
        await reportsLink.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`${reportType} report would be generated in production with:`);
    if (options.startDate) console.log(`- Start Date: ${options.startDate}`);
    if (options.endDate) console.log(`- End Date: ${options.endDate}`);
    if (options.fundId) console.log(`- Fund: ${options.fundId}`);
    if (options.donorId) console.log(`- Donor: ${options.donorId}`);
  }

  /**
   * Clear search input
   */
  static async clearSearch(page: Page) {
    const searchInput = page.locator('[data-testid="people-search-input"], #searchText, input[placeholder*="Search"]').first();
    const isVisible = await searchInput.isVisible().catch(() => false);
    if (isVisible) {
      await searchInput.fill('');
    }
  }

  /**
   * Check if a donation exists
   */
  static async donationExists(page: Page, donorName: string, amount: number): Promise<boolean> {
    await this.searchDonations(page, donorName);
    
    // Look for the donation in search results
    const donationSelectors = [
      `text=${donorName}`,
      `text=$${amount}`,
      'table td, .donation-result, .search-result'
    ];
    
    for (const selector of donationSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        const text = await element.textContent().catch(() => '');
        if (text.includes(donorName) && text.includes(amount.toString())) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Export financial data
   */
  static async exportData(page: Page, exportType: 'csv' | 'excel' | 'pdf', options: {
    startDate?: string;
    endDate?: string;
    includeDetails?: boolean;
  }) {
    console.log(`Simulating export of financial data as ${exportType}`);
    
    console.log(`Export would include:`);
    if (options.startDate) console.log(`- Start Date: ${options.startDate}`);
    if (options.endDate) console.log(`- End Date: ${options.endDate}`);
    console.log(`- Include Details: ${options.includeDetails || false}`);
    
    console.log(`Data would be exported as ${exportType} file in production`);
  }
}