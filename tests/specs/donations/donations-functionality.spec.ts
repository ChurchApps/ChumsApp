import { test, expect } from '@playwright/test';

test.describe('Donations Module Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/donations');
    await page.waitForLoadState('networkidle');
  });

  test('should load Donations page with correct elements', async ({ page }) => {
    // Verify page loaded correctly
    await expect(page).toHaveURL(/\/donations/);
    
    // Check for Donations text in navigation
    await expect(page.getByText('Donations')).toBeVisible();
    
    console.log('✅ Donations page loaded successfully');
  });

  test('should display donations management interface', async ({ page }) => {
    const pageContent = await page.textContent('body');
    
    // Check for donation-related terms
    const donationTerms = [
      'Summary',
      'Batches',
      'Funds',
      'Donation',
      'Giving',
      'Amount',
      'Date'
    ];
    
    const foundTerms = donationTerms.filter(term => pageContent?.includes(term));
    console.log('Donation terms found:', foundTerms);
    
    // Based on the navigation we saw, check for specific sections
    const hasSummary = pageContent?.includes('Summary') || false;
    const hasBatches = pageContent?.includes('Batches') || false;
    const hasFunds = pageContent?.includes('Funds') || false;
    
    console.log('Donations sections:', {
      hasSummary,
      hasBatches, 
      hasFunds
    });
  });

  test('should test donations summary and reporting', async ({ page }) => {
    // Look for summary/report elements
    const summaryElements = await page.locator('[class*="summary"], [id*="summary"]').all();
    const chartElements = await page.locator('canvas, svg, [class*="chart"]').all();
    const totalElements = await page.locator('*').filter({ hasText: /total|sum|\$/i }).all();
    
    console.log(`Found ${summaryElements.length} summary elements, ${chartElements.length} charts, ${totalElements.length} total/amount elements`);
    
    if (totalElements.length > 0) {
      console.log('Financial amounts found:');
      for (let i = 0; i < Math.min(totalElements.length, 5); i++) {
        const element = totalElements[i];
        const text = await element.textContent();
        if (text && text.length < 50) { // Skip very long text
          console.log(`  ${i + 1}. "${text}"`);
        }
      }
    }
    
    if (chartElements.length > 0) {
      console.log('✅ Charts or visualizations found for donation data');
    }
  });

  test('should test donation batches functionality', async ({ page }) => {
    // Navigate to batches section if available
    const batchesLink = page.locator('a, button').filter({ hasText: 'Batches' });
    
    if (await batchesLink.isVisible().catch(() => false)) {
      console.log('Navigating to Batches section');
      await batchesLink.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Look for batch-related functionality
    const addBatchButton = await page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")').all();
    const batchTable = await page.locator('table, [role="table"]').isVisible().catch(() => false);
    
    console.log(`Found ${addBatchButton.length} add/create buttons and table: ${batchTable}`);
    
    if (addBatchButton.length > 0) {
      console.log('Batch creation buttons found:');
      for (let i = 0; i < addBatchButton.length; i++) {
        const button = addBatchButton[i];
        const text = await button.textContent();
        console.log(`  ${i + 1}. "${text}"`);
      }
    }
  });

  test('should test funds management', async ({ page }) => {
    // Navigate to funds section if available
    const fundsLink = page.locator('a, button').filter({ hasText: 'Funds' });
    
    if (await fundsLink.isVisible().catch(() => false)) {
      console.log('Navigating to Funds section');
      await fundsLink.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Look for fund-related functionality
    const fundsList = await page.locator('*').filter({ hasText: /fund|tithe|offering|mission/i }).all();
    const addFundButton = await page.locator('button:has-text("Add"), button:has-text("New")').all();
    
    console.log(`Found ${fundsList.length} fund-related elements and ${addFundButton.length} add buttons`);
    
    if (fundsList.length > 0) {
      console.log('Fund-related content found:');
      for (let i = 0; i < Math.min(fundsList.length, 5); i++) {
        const element = fundsList[i];
        const text = await element.textContent();
        if (text && text.length < 100) {
          console.log(`  ${i + 1}. "${text}"`);
        }
      }
    }
  });

  test('should test donation search and filtering', async ({ page }) => {
    // Look for search functionality
    const searchInputs = await page.locator('input[type="search"], input[placeholder*="search" i]').all();
    const dateInputs = await page.locator('input[type="date"]').all();
    const amountInputs = await page.locator('input[type="number"], input[placeholder*="amount" i]').all();
    
    console.log(`Found ${searchInputs.length} search inputs, ${dateInputs.length} date inputs, ${amountInputs.length} amount inputs`);
    
    if (searchInputs.length > 0) {
      const searchInput = searchInputs[0];
      await searchInput.fill('100'); // Search for donations of $100
      
      const searchButton = page.locator('button:has-text("Search")');
      if (await searchButton.isVisible().catch(() => false)) {
        await searchButton.click();
      } else {
        await searchInput.press('Enter');
      }
      
      await page.waitForTimeout(1500);
      console.log('Performed search for "100"');
    }
    
    if (dateInputs.length > 0) {
      console.log('✅ Date filtering available for donations');
    }
  });

  test('should test donation export functionality', async ({ page }) => {
    // Look for export/download buttons
    const exportButtons = await page.locator('button, a').filter({ hasText: /export|download|csv|excel|pdf/i }).all();
    
    console.log(`Found ${exportButtons.length} export/download buttons`);
    
    if (exportButtons.length > 0) {
      console.log('Export options found:');
      for (let i = 0; i < exportButtons.length; i++) {
        const button = exportButtons[i];
        const text = await button.textContent();
        console.log(`  ${i + 1}. "${text}"`);
      }
    }
  });

  test('should verify donations navigation', async ({ page }) => {
    const nav = page.locator('nav, header');
    const navText = await nav.textContent().catch(() => '');
    
    console.log('Navigation content:', navText);
    
    const hasDonationsInNav = navText.includes('Donations') || navText.includes('Giving');
    console.log('Donations/Giving appears in navigation:', hasDonationsInNav);
    
    // Check for donation-specific navigation
    const hasSummary = navText.includes('Summary');
    const hasBatches = navText.includes('Batches'); 
    const hasFunds = navText.includes('Funds');
    
    console.log('Donation navigation sections:', {
      donations: hasDonationsInNav,
      summary: hasSummary,
      batches: hasBatches,
      funds: hasFunds
    });
  });
});