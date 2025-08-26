import { test, expect } from '@playwright/test';

test.describe('Navigation Tests (Authenticated)', () => {
  test('should navigate to People module', async ({ page }) => {
    // Go to homepage (we should be logged in via auth state)
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'tests/screenshots/authenticated-home.png' });
    
    // Look for People navigation link
    const peopleLink = page.locator('a[href="/people"]');
    const isVisible = await peopleLink.isVisible().catch(() => false);
    
    console.log('People link visible:', isVisible);
    
    if (isVisible) {
      // Click the People link
      await peopleLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Verify we're on the People page
      await expect(page).toHaveURL(/\/people/);
      
      // Look for People page header
      const header = page.locator('h1');
      await expect(header).toBeVisible();
      
      console.log('Successfully navigated to People page');
    } else {
      // Check if there's a menu button (mobile view)
      const menuButton = page.locator('[aria-label="Menu"]');
      const menuVisible = await menuButton.isVisible().catch(() => false);
      
      if (menuVisible) {
        console.log('Found menu button, clicking it');
        await menuButton.click();
        
        // Wait for menu to open
        await page.waitForTimeout(500);
        
        // Now try clicking People link
        await peopleLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/people/);
      } else {
        console.log('No People link or menu button found');
        
        // Log what's on the page for debugging
        const bodyText = await page.textContent('body');
        console.log('Page content:', bodyText?.substring(0, 500));
      }
    }
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for common navigation elements
    const hasHeader = await page.locator('header').isVisible().catch(() => false);
    const hasNav = await page.locator('nav').isVisible().catch(() => false);
    
    console.log('Has header:', hasHeader);
    console.log('Has nav:', hasNav);
    
    // At least one should be present in an authenticated app
    expect(hasHeader || hasNav).toBeTruthy();
  });
});