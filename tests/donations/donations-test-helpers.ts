import { Page, expect } from '@playwright/test';
import { DonationsPage } from '../pages/donations-page';
import { FundsPage } from '../pages/funds-page';
import { SharedSetup } from '../utils/shared-setup';

export class DonationsTestHelpers {
  
  /**
   * Main helper for testing donations page functionality - expects it to work
   */
  static async performDonationsPageTest(
    page: Page, 
    testName: string, 
    donationsPage: DonationsPage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/donations');
    await donationsPage.expectToBeOnDonationsPage();
    await testFunction();
    console.log(`${testName} verified on donations page`);
  }

  /**
   * Helper for testing funds page functionality - expects it to work
   */
  static async performFundsPageTest(
    page: Page, 
    testName: string, 
    fundsPage: FundsPage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/donations/funds');
    await fundsPage.expectToBeOnFundsPage();
    await testFunction();
    console.log(`${testName} verified on funds page`);
  }

  /**
   * Helper to test donations display functionality
   */
  static async testDonationsDisplay(page: Page, donationsPage: DonationsPage) {
    console.log('Testing donations display functionality');
    
    await donationsPage.expectLoadingComplete();
    
    const hasReport = await donationsPage.expectDonationsReportVisible();
    expect(hasReport).toBeTruthy();
    
    const donationsCount = await donationsPage.getDonationsCount();
    console.log(`Found ${donationsCount} donation records`);
    
    return true;
  }

  /**
   * Helper to test donations search functionality
   */
  static async testDonationsSearch(page: Page, donationsPage: DonationsPage, searchTerm: string) {
    console.log(`Testing donations search for: ${searchTerm}`);
    
    const searchSuccessful = await donationsPage.searchDonations(searchTerm);
    expect(searchSuccessful).toBeTruthy();
    
    console.log(`Donations search completed for term: ${searchTerm}`);
    return true;
  }

  /**
   * Helper to test donations filtering functionality
   */
  static async testDonationFiltering(page: Page, donationsPage: DonationsPage) {
    console.log('Testing donation filtering');
    
    const filterAvailable = await donationsPage.expectFilterAvailable();
    expect(filterAvailable).toBeTruthy();
    
    const filterClicked = await donationsPage.clickFilter();
    expect(filterClicked).toBeTruthy();
    
    console.log('Filter functionality available');
    return true;
  }

  /**
   * Helper to test donations export functionality
   */
  static async testDonationsExport(page: Page, donationsPage: DonationsPage) {
    console.log('Testing donations export');
    
    const exportAvailable = await donationsPage.expectExportAvailable();
    expect(exportAvailable).toBeTruthy();
    
    console.log('Export functionality available');
    return true;
  }

  /**
   * Helper to test funds display functionality
   */
  static async testFundsDisplay(page: Page, fundsPage: FundsPage) {
    console.log('Testing funds display functionality');
    
    await fundsPage.expectLoadingComplete();
    
    const hasFundsList = await fundsPage.expectFundsDisplayed();
    expect(hasFundsList).toBeTruthy();
    
    const fundsCount = await fundsPage.getFundsCount();
    console.log(`Found ${fundsCount} funds`);
    
    return true;
  }

  /**
   * Helper to test add fund functionality
   */
  static async testAddFundFunctionality(page: Page, fundsPage: FundsPage) {
    console.log('Testing add fund functionality');
    
    const addFundAvailable = await fundsPage.expectAddFundAvailable();
    expect(addFundAvailable).toBeTruthy();
    
    const addFundClicked = await fundsPage.clickAddFund();
    expect(addFundClicked).toBeTruthy();
    
    console.log('Add fund functionality available');
    return true;
  }

  /**
   * Helper to test fund navigation
   */
  static async testFundNavigation(page: Page, fundsPage: FundsPage) {
    console.log('Testing fund navigation');
    
    const fundsCount = await fundsPage.getFundsCount();
    expect(fundsCount).toBeGreaterThan(0);
    
    const fundClicked = await fundsPage.clickFirstFund();
    expect(fundClicked).toBeTruthy();
    
    console.log('Successfully navigated to fund details');
    return true;
  }

  /**
   * Helper to test funds search functionality
   */
  static async testFundsSearch(page: Page, fundsPage: FundsPage, searchTerm: string) {
    console.log(`Testing funds search for: ${searchTerm}`);
    
    const searchSuccessful = await fundsPage.searchFunds(searchTerm);
    expect(searchSuccessful).toBeTruthy();
    
    console.log(`Funds search completed for term: ${searchTerm}`);
    return true;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    const components = {
      donationsReport: {
        title: 'h1:has-text("Donations"), h1:has-text("Donation")',
        content: '#mainContent, .report-container, table'
      },
      fundsManagement: {
        title: 'h1:has-text("Funds"), h1:has-text("Fund")',
        content: '#mainContent, .funds-container, table'
      },
      navigation: {
        title: 'h1',
        content: '#mainContent'
      }
    };

    const config = components[componentType] || components.navigation;
    
    const hasTitle = await page.locator(config.title).first().isVisible().catch(() => false);
    const hasContent = await page.locator(config.content).first().isVisible().catch(() => false);
    
    expect(hasTitle || hasContent).toBeTruthy();
    console.log(`${componentType} page accessible and main components visible`);
    return true;
  }

  /**
   * Helper to test donation totals display
   */
  static async testDonationTotals(page: Page, donationsPage: DonationsPage) {
    console.log('Testing donation totals display');
    
    const hasTotalDisplay = await donationsPage.expectTotalAmountVisible();
    expect(hasTotalDisplay).toBeTruthy();
    
    const totalAmount = await donationsPage.getTotalAmount();
    expect(totalAmount).toBeTruthy();
    
    console.log(`Total donation amount displayed: ${totalAmount}`);
    return true;
  }

  /**
   * Common search terms for testing
   */
  static getSearchTerms() {
    return {
      basic: ['Donation', 'Tithe', 'Offering', 'Fund'],
      partial: ['Don', 'Tit', 'Off'],
      caseInsensitive: ['donation', 'DONATION', 'Donation', 'DoNaTiOn'],
      amounts: ['100', '50.00', '$25', '$100.00'],
      rapid: ['D', 'Do', 'Don', 'Dona']
    };
  }
}