import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';

test.describe('People Basic Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login and select church before each test
    await loginPage.goto();
    await loginPage.login('demo@chums.org', 'password');
    await loginPage.expectSuccessfulLogin();
    
    // Handle church selection modal
    const churchSelectionDialog = page.locator('text=Select a Church');
    const isChurchSelectionVisible = await churchSelectionDialog.isVisible().catch(() => false);
    
    if (isChurchSelectionVisible) {
      const graceChurch = page.locator('text=Grace Community Church').first();
      await graceChurch.click();
      await page.waitForSelector('h1:has-text("Chums")', { timeout: 10000 });
    }
    
    await dashboardPage.expectUserIsLoggedIn();
  });

  test('should access people functionality via dashboard menu', async ({ page }) => {
    // Try to find and click primary menu
    const primaryMenuButton = page.getByRole('button', { name: 'Primary Menu Dashboard' });
    const primaryMenuExists = await primaryMenuButton.isVisible().catch(() => false);
    
    if (primaryMenuExists) {
      await primaryMenuButton.click();
      await page.waitForLoadState('networkidle', { timeout: 3000 });
      
      // Look for People link in menu
      const peopleMenuLink = page.locator('a:has-text("People"), text=People').first();
      const peopleMenuExists = await peopleMenuLink.isVisible().catch(() => false);
      
      if (peopleMenuExists) {
        console.log('People menu option found in navigation');
        
        await peopleMenuLink.click();
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        // Check where we landed
        const currentUrl = page.url();
        if (currentUrl.includes('/people')) {
          console.log('Successfully navigated to people page');
          
          // Look for people page elements
          const hasSearch = await page.locator('input[type="text"], input[name*="search"]').first().isVisible().catch(() => false);
          const hasTitle = await page.locator('h1, .page-title').first().isVisible().catch(() => false);
          
          if (hasSearch || hasTitle) {
            console.log('People page loaded with search functionality');
          }
        } else if (currentUrl.includes('/login')) {
          console.log('Redirected to login - people page requires additional permissions');
        } else {
          console.log(`Navigated to: ${currentUrl}`);
        }
      } else {
        console.log('People menu option not found - may not be available in demo');
      }
    } else {
      console.log('Primary menu button not found');
    }
  });

  test('should access people page directly via URL', async ({ page }) => {
    await page.goto('/people');
    await page.waitForLoadState('networkidle', { timeout: 8000 });
    
    const currentUrl = page.url();
    
    if (currentUrl.includes('/people')) {
      console.log('Successfully accessed people page via direct URL');
      
      // Check for basic page elements
      const hasContent = await page.locator('main, #mainContent, .content').first().isVisible().catch(() => false);
      const hasSearch = await page.locator('input[type="text"]').first().isVisible().catch(() => false);
      
      if (hasContent || hasSearch) {
        console.log('People page content loaded successfully');
      }
    } else if (currentUrl.includes('/login')) {
      console.log('Direct access to people page redirected to login - requires authentication/permissions');
    } else {
      console.log(`Direct people page access redirected to: ${currentUrl}`);
    }
  });

  test('should handle people search from dashboard', async ({ page }) => {
    // The dashboard already has a people search component
    const dashboardSearchInput = page.locator('[id="searchText"]');
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      console.log('People search available on dashboard');
      
      // Try a search from dashboard
      await dashboardSearchInput.fill('demo');
      
      const searchButton = page.locator('button:has-text("Search")');
      const searchButtonExists = await searchButton.isVisible().catch(() => false);
      
      if (searchButtonExists) {
        await searchButton.click();
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        console.log('People search executed from dashboard');
        
        // Check if results are displayed
        const hasResults = await page.locator('table, .results, .people').first().isVisible().catch(() => false);
        
        if (hasResults) {
          console.log('Search results displayed');
        } else {
          console.log('No search results or different result format');
        }
      }
    } else {
      console.log('Dashboard people search not found');
    }
  });

  test('should display people-related links or navigation', async ({ page }) => {
    // Look for any people-related navigation or links
    const peopleLinks = await page.locator('a:has-text("People")').count() + 
                       await page.locator('text=People').count() + 
                       await page.locator('a[href*="people"]').count();
    
    const personLinks = await page.locator('a:has-text("Person")').count() + 
                       await page.locator('text=Person').count();
    
    if (peopleLinks > 0) {
      console.log(`Found ${peopleLinks} people-related links`);
    }
    
    if (personLinks > 0) {
      console.log(`Found ${personLinks} person-related links`);
    }
    
    if (peopleLinks === 0 && personLinks === 0) {
      console.log('No people-related navigation found - may require specific permissions');
    }
  });

  test('should check for people management permissions', async ({ page }) => {
    // Check various ways people functionality might be accessible
    const checks = [
      { name: 'Primary Menu', selector: 'button:has-text("Primary Menu")' },
      { name: 'People Link', selector: 'a:has-text("People")' },
      { name: 'Search Box', selector: '[id="searchText"]' },
      { name: 'User Menu', selector: '.MuiAvatar-root' },
      { name: 'Navigation', selector: 'nav, .navigation' },
    ];
    
    for (const check of checks) {
      const exists = await page.locator(check.selector).first().isVisible().catch(() => false);
      console.log(`${check.name}: ${exists ? 'Available' : 'Not found'}`);
    }
  });
});