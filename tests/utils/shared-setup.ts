import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { TestHelpers } from './test-helpers';

export class SharedSetup {
  static async loginAndSelectChurch(page: Page) {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login('demo@chums.org', 'password');
    await loginPage.expectSuccessfulLogin();
    
    // Handle church selection
    await TestHelpers.waitForChurchSelection(page);
    
    // Verify we're logged in
    await dashboardPage.expectUserIsLoggedIn();
  }
  
  static async ensureAuthenticated(page: Page) {
    // Check if we're already authenticated
    const isOnLogin = page.url().includes('/login');
    
    if (isOnLogin) {
      await this.loginAndSelectChurch(page);
    } else {
      // Still might need church selection
      await TestHelpers.waitForChurchSelection(page);
    }
  }
  
  static async navigateToPage(page: Page, path: string) {
    await page.goto(path);
    await TestHelpers.waitForPageLoad(page);
    
    // Wait a bit to see if there's a delayed redirect to login (React app auth check)
    await page.waitForTimeout(3000);
    
    // Handle potential redirect to login (immediate or delayed)
    if (page.url().includes('/login')) {
      // Fill and submit login form directly
      await page.fill('input[type="email"]', 'demo@chums.org');
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');
      
      // Wait a bit for the login to process
      await page.waitForLoadState('networkidle');
      
      // Handle church selection dialog
      try {
        const churchDialog = page.locator('text=Select a Church');
        await churchDialog.waitFor({ timeout: 10000 });
        
        const graceChurch = page.locator('text=Grace Community Church').first();
        await graceChurch.click();
        
        // Wait for the dialog to close
        await page.waitForLoadState('networkidle');
        
        // Navigate back to the original path after church selection
        await page.goto(path);
        await TestHelpers.waitForPageLoad(page);
        
      } catch (error) {
        // Church selection dialog may not appear
        // Try navigating to the path directly
        if (!page.url().includes(path)) {
          await page.goto(path);
          await TestHelpers.waitForPageLoad(page);
        }
      }
    } else {
      // Still might need church selection even if not redirected to login
      await TestHelpers.waitForChurchSelection(page);
      
      // Ensure we're on the correct path after church selection
      if (!page.url().includes(path)) {
        await page.goto(path);
        await TestHelpers.waitForPageLoad(page);
      }
    }
  }

  static async navigateDirectly(page: Page, path: string) {
    // Navigate directly to the path - if not authenticated, will redirect to login
    // After login, should redirect back to the original path
    await this.navigateToPage(page, path);
  }
}