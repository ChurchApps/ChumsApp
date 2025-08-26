import { test, expect } from '@playwright/test';

test.describe('Groups and People Navigation', () => {
  test('should navigate to a group page and explore People functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on one of the group links from the dashboard
    const adultBibleClass = page.locator('a:has-text("Adult Bible Class")');
    await expect(adultBibleClass).toBeVisible();
    
    console.log('Clicking Adult Bible Class');
    await adultBibleClass.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of group page
    await page.screenshot({ path: 'tests/screenshots/group-page.png' });
    
    // Check what's on the group page
    const url = page.url();
    console.log('Group page URL:', url);
    
    // Look for People-related functionality on the group page
    const pageContent = await page.textContent('body');
    console.log('Group page content preview:', pageContent?.substring(0, 500));
    
    // Check if there are navigation links to People from here
    const peopleLinks = await page.locator('a').filter({ hasText: /people/i }).all();
    console.log(`Found ${peopleLinks.length} links containing 'people'`);
    
    for (let i = 0; i < peopleLinks.length; i++) {
      const link = peopleLinks[i];
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      console.log(`People link ${i + 1}: "${text}" -> ${href}`);
    }
    
    // Look for member/person management functionality
    const memberButtons = await page.locator('button, a').filter({ hasText: /member|person|add|edit/i }).all();
    console.log(`Found ${memberButtons.length} member-related buttons`);
    
    for (let i = 0; i < Math.min(memberButtons.length, 5); i++) {
      const button = memberButtons[i];
      const text = await button.textContent();
      console.log(`Member button ${i + 1}: "${text}"`);
    }
  });

  test('should test dashboard People search and try to access full People page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try searching in the People section
    const searchInput = page.locator('input[placeholder*="Search"], input[name="search"]').first();
    await searchInput.fill('Demo');
    
    // Click search or press enter
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);
    
    // Take screenshot of search results
    await page.screenshot({ path: 'tests/screenshots/people-search-demo.png' });
    
    // Check if search results show any people
    const resultsText = await page.textContent('body');
    console.log('Search results contain Demo:', resultsText?.includes('Demo'));
    
    // Look for "View All" or similar link to go to full People page
    const viewAllLinks = await page.locator('a, button').filter({ hasText: /view all|see all|more|all people/i }).all();
    console.log(`Found ${viewAllLinks.length} "view all" type links`);
    
    for (const link of viewAllLinks) {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      console.log(`View all link: "${text}" -> ${href}`);
      
      // If this looks like it goes to People page, try clicking it
      if (href && (href.includes('/people') || text?.toLowerCase().includes('people'))) {
        console.log('Clicking link that seems to go to People page');
        await link.click();
        await page.waitForLoadState('networkidle');
        
        console.log('New URL after click:', page.url());
        await page.screenshot({ path: 'tests/screenshots/after-people-link-click.png' });
        break;
      }
    }
  });

  test('should try direct navigation to /people URL', async ({ page }) => {
    // Try going directly to /people to see if it exists
    await page.goto('/people');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    console.log('Direct /people URL result:', url);
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/direct-people-url.png' });
    
    // Check if we got a valid People page or were redirected
    const pageContent = await page.textContent('body');
    
    if (url.includes('/people')) {
      console.log('Successfully accessed /people page');
      console.log('People page content preview:', pageContent?.substring(0, 500));
      
      // Look for typical People page elements
      const hasAddButton = pageContent?.includes('Add') || false;
      const hasSearchInput = await page.locator('input[type="search"], input[placeholder*="search"]').isVisible().catch(() => false);
      const hasTable = await page.locator('table').isVisible().catch(() => false);
      
      console.log('People page features found:', {
        hasAddButton,
        hasSearchInput,
        hasTable
      });
      
    } else {
      console.log('Redirected away from /people, possibly not accessible directly');
    }
  });
});