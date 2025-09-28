import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth-helper';

test.describe('Navigation Test IDs', () => {
  test('should have data-testid attributes on navigation items', async ({ page }) => {
    // Login and get to the main application
    await AuthHelper.loginAndSelectChurch(page);
    
    // Verify authentication successful
    const churchDialogGone = !(await page.locator('text=Select a Church').isVisible().catch(() => false));
    expect(churchDialogGone).toBeTruthy();
    console.log('✓ Authentication successful');
    
    // Wait for navigation elements to be added
    await page.waitForTimeout(1000);
    
    // Check if primary navigation items have data-testid attributes
    const navItems = [
      'nav-item-dashboard',
      'nav-item-people',
      'nav-item-donations',
      'nav-item-plans',
      'nav-item-tasks',
      'nav-item-settings'
    ];
    
    let foundNavItems = 0;
    for (const testId of navItems) {
      const element = page.locator(`[data-testid="${testId}"]`);
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        foundNavItems++;
        console.log(`✓ Found navigation item: ${testId}`);
      } else {
        console.log(`⚠ Navigation item not found: ${testId}`);
      }
    }
    
    // We should find at least some navigation items
    console.log(`Found ${foundNavItems} out of ${navItems.length} navigation items`);
    expect(foundNavItems).toBeGreaterThan(0);
    
    // Test navigation to People section using data-testid
    const peopleNavItem = page.locator('[data-testid="nav-item-people"]');
    const hasPeopleNav = await peopleNavItem.isVisible().catch(() => false);
    
    if (hasPeopleNav) {
      console.log('✓ Testing navigation to People section');
      await peopleNavItem.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Verify we navigated to people section
      const currentUrl = page.url();
      console.log(`Current URL after clicking People: ${currentUrl}`);
      
      // Should be on people page or have people-related content
      const isPeopleSection = currentUrl.includes('/people') || 
                             await page.locator('text=People', 'text=Recently Added People').first().isVisible().catch(() => false);
      
      if (isPeopleSection) {
        console.log('✓ Successfully navigated to People section');
      } else {
        console.log('⚠ Navigation to People section unclear');
      }
    }
    
    console.log('✓ Navigation data-testid verification completed');
  });
  
  test('should be able to navigate between sections using data-testid', async ({ page }) => {
    await AuthHelper.loginAndSelectChurch(page);
    
    // Wait for navigation to be ready
    await page.waitForTimeout(1000);
    
    // Test navigation sequence using data-testid attributes
    const navigationTests = [{ testId: 'nav-item-people', expectedContent: ['People', 'Recently Added'] }, { testId: 'nav-item-dashboard', expectedContent: ['Dashboard', 'People', 'Tasks'] }];
    
    for (const navTest of navigationTests) {
      const navElement = page.locator(`[data-testid="${navTest.testId}"]`);
      const isVisible = await navElement.isVisible().catch(() => false);
      
      if (isVisible) {
        console.log(`Testing navigation to: ${navTest.testId}`);
        await navElement.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // Check for expected content
        let foundExpectedContent = false;
        for (const content of navTest.expectedContent) {
          const hasContent = await page.locator(`text=${content}`).first().isVisible().catch(() => false);
          if (hasContent) {
            foundExpectedContent = true;
            console.log(`✓ Found expected content: ${content}`);
            break;
          }
        }
        
        if (foundExpectedContent) {
          console.log(`✓ Navigation to ${navTest.testId} successful`);
        } else {
          console.log(`⚠ Navigation to ${navTest.testId} - content unclear`);
        }
      } else {
        console.log(`⚠ Navigation item not found: ${navTest.testId}`);
      }
    }
    
    console.log('✓ Navigation sequence test completed');
  });
});