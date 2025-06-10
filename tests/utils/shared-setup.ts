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
    
    // Handle potential redirect to login
    if (page.url().includes('/login')) {
      await this.loginAndSelectChurch(page);
      // Navigate again after login
      await page.goto(path);
      await TestHelpers.waitForPageLoad(page);
    }
    
    // Handle church selection if needed
    await TestHelpers.waitForChurchSelection(page);
  }
}