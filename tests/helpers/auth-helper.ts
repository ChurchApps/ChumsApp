import { Page, expect } from '@playwright/test';

export class AuthHelper {
  /**
   * Basic login - fills form and submits, checks for church selection dialog
   */
  static async login(page: Page, email = 'demo@chums.org', password = 'password') {
    // Navigate to the login page
    await page.goto('https://chumsdemo.churchapps.org/');
    
    // Verify we're on the login page
    await expect(page).toHaveURL(/.*login/);
    
    // Fill in login credentials
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    
    console.log('Login form submitted successfully');
    return true;
  }

  /**
   * Complete login flow including church selection
   */
  static async loginAndSelectChurch(page: Page, email = 'demo@chums.org', password = 'password') {
    await this.login(page, email, password);
    
    // Handle church selection if it appears
    const hasChurchSelection = await page.locator('text=Select a Church').isVisible().catch(() => false);
    
    if (hasChurchSelection) {
      await this.selectGraceCommunityChurch(page);
    }
    
    console.log('Login and church selection completed');
    return true;
  }

  /**
   * Select Grace Community Church from the church selection dialog
   */
  static async selectGraceCommunityChurch(page: Page) {
    const graceChurchSelectors = [
      'text=Grace Community Church',
      'button:has-text("Grace Community Church")',
      '[role="button"]:has-text("Grace Community Church")',
      '.MuiButton-root:has-text("Grace Community Church")'
    ];
    
    let clicked = false;
    for (const selector of graceChurchSelectors) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          await element.click({ force: true });
          clicked = true;
          console.log(`Selected Grace Community Church using: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to click with selector: ${selector}`);
      }
    }
    
    if (clicked) {
      await page.waitForLoadState('networkidle');
      console.log('Church selection completed');
    } else {
      console.log('Could not find Grace Community Church button');
    }
    
    return clicked;
  }

  /**
   * Check if user is currently logged in
   */
  static async isLoggedIn(page: Page) {
    const loginIndicators = [
      '.MuiAvatar-root',
      'h1:has-text("Chums")',
      '[id="peopleBox"]',
      'text=Tasks'
    ];
    
    for (const selector of loginIndicators) {
      const isVisible = await page.locator(selector).first().isVisible().catch(() => false);
      if (isVisible) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Navigate to the login page
   */
  static async goToLogin(page: Page) {
    await page.goto('https://chumsdemo.churchapps.org/');
    await expect(page).toHaveURL(/.*login/);
  }
}