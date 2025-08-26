import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation Exploration', () => {
  test('should explore dashboard navigation options', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the dashboard
    await expect(page.locator('h1')).toContainText('Chums Dashboard');
    
    // Try clicking on the Dashboard dropdown to see navigation options
    const dashboardDropdown = page.locator('button:has-text("Dashboard")').first();
    if (await dashboardDropdown.isVisible()) {
      console.log('Found Dashboard dropdown, clicking it');
      await dashboardDropdown.click();
      
      // Wait for dropdown to open
      await page.waitForTimeout(1000);
      
      // Take screenshot to see dropdown options
      await page.screenshot({ path: 'tests/screenshots/dashboard-dropdown-open.png' });
      
      // Look for navigation links in the dropdown
      const peopleOption = page.locator('a:has-text("People")').or(page.locator('li:has-text("People")')).or(page.locator('[role="menuitem"]:has-text("People")'));
      
      if (await peopleOption.isVisible()) {
        console.log('Found People option in dropdown');
        await peopleOption.click();
        
        // Wait for navigation
        await page.waitForLoadState('networkidle');
        
        // Verify we navigated to People page
        await expect(page).toHaveURL(/\/people/);
        console.log('Successfully navigated to People page');
        
        // Take screenshot of People page
        await page.screenshot({ path: 'tests/screenshots/people-page.png' });
      } else {
        console.log('No People option found in dropdown');
        
        // List all visible options
        const dropdownItems = await page.locator('[role="menu"] li, [role="menu"] a, .MuiMenuItem-root').allTextContents();
        console.log('Available dropdown items:', dropdownItems);
      }
    }
  });

  test('should test dashboard People search functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find the People search input on the dashboard
    const searchInput = page.locator('input[placeholder*="Search"], input[name*="search"]').first();
    
    if (await searchInput.isVisible()) {
      console.log('Found search input');
      
      // Try searching for a person
      await searchInput.fill('Demo');
      
      // Look for search button or just wait for results
      const searchButton = page.locator('button:has-text("Search"), button[type="submit"]').first();
      if (await searchButton.isVisible()) {
        await searchButton.click();
      } else {
        // Try pressing Enter
        await searchInput.press('Enter');
      }
      
      // Wait for search results
      await page.waitForTimeout(2000);
      
      // Take screenshot of search results
      await page.screenshot({ path: 'tests/screenshots/people-search-results.png' });
      
      console.log('Performed search');
    }
  });

  test('should explore all clickable elements on dashboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find all clickable elements (links, buttons)
    const clickableElements = await page.locator('a, button').all();
    
    console.log(`Found ${clickableElements.length} clickable elements`);
    
    for (let i = 0; i < Math.min(clickableElements.length, 10); i++) {
      const element = clickableElements[i];
      const text = await element.textContent().catch(() => '');
      const tag = await element.evaluate(el => el.tagName).catch(() => '');
      const href = await element.getAttribute('href').catch(() => '');
      
      console.log(`${i + 1}. ${tag}: "${text}" href="${href}"`);
    }
  });
});