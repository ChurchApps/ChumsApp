import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth-helper';

test.describe('People Debug', () => {
  test('debug navigation after login', async ({ page }) => {
    console.log('Starting login process...');
    
    // Use the working auth helper
    await AuthHelper.loginAndSelectChurch(page);
    console.log('After login and church selection URL:', page.url());
    
    // Try different ways to navigate to people
    console.log('\nAttempting navigation methods:');
    
    // Method 1: Direct URL navigation
    console.log('1. Trying direct navigation to /people');
    await page.goto('https://chumsdemo.churchapps.org/people');
    await page.waitForLoadState('networkidle');
    console.log('Direct navigation result URL:', page.url());
    
    // Check what's on the page
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Look for any content
    const hasLoginForm = await page.locator('input[type="email"]').isVisible().catch(() => false);
    const hasPeopleContent = await page.locator('text=People').isVisible().catch(() => false);
    const hasSearchBox = await page.locator('#searchText').isVisible().catch(() => false);
    
    console.log('Has login form:', hasLoginForm);
    console.log('Has people content:', hasPeopleContent);
    console.log('Has search box:', hasSearchBox);
    
    // If we're back on login, let's try logging in again and navigating differently
    if (hasLoginForm) {
      console.log('\n2. Back on login page, trying full flow again');
      await page.fill('input[type="email"]', 'demo@chums.org');
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      
      // Handle church selection again
      const hasChurchDialog2 = await page.locator('text=Select a Church').isVisible().catch(() => false);
      if (hasChurchDialog2) {
        await page.locator('text=Grace Community Church').first().click();
        await page.waitForLoadState('networkidle');
      }
      
      // Now look for navigation menu
      console.log('\n3. Looking for navigation menu');
      const menuSelectors = [
        'button[aria-label*="menu"]',
        'button:has-text("Menu")',
        '.MuiIconButton-root',
        'nav',
        'header button'
      ];
      
      for (const selector of menuSelectors) {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          console.log(`Found menu element: ${selector}`);
          await element.click();
          await page.waitForTimeout(1000);
          
          // Look for people link in menu
          const peopleLink = page.locator('a[href="/people"]').first();
          const textLink = page.locator('text=People').first();
          if (await peopleLink.isVisible() || await textLink.isVisible()) {
            console.log('Found People link in menu');
            await peopleLink.click();
            await page.waitForLoadState('networkidle');
            console.log('After menu navigation URL:', page.url());
            break;
          }
        }
      }
    }
    
    // Final check - what page are we on?
    const finalUrl = page.url();
    console.log('\nFinal URL:', finalUrl);
    const finalContent = await page.locator('body').textContent();
    console.log('Page contains "People":', finalContent?.includes('People'));
    console.log('Page contains "Add Person":', finalContent?.includes('Add Person'));
    console.log('Page contains "Search":', finalContent?.includes('Search'));
  });
});