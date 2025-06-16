import { expect, Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors - More flexible to handle different form structures
  get emailInput() { 
    return this.page.locator('input[type="email"]').first(); 
  }
  get passwordInput() { 
    return this.page.locator('input[type="password"]').first(); 
  }
  get loginButton() { 
    return this.page.locator('button[type="submit"], button:has-text("Sign In")').first(); 
  }
  get errorMessage() { return this.page.locator('.error, .alert-danger, [role="alert"]'); }
  get forgotPasswordLink() { return this.page.locator('a:has-text("Forgot"), a:has-text("forgot")'); }

  // Actions
  async goto() {
    await this.page.goto('/login');
    await TestHelpers.waitForPageLoad(this.page);
  }

  async fillEmail(email: string) {
    await TestHelpers.fillAndWait(this.page, this.emailInput, email);
  }

  async fillPassword(password: string) {
    await TestHelpers.fillAndWait(this.page, this.passwordInput, password);
  }

  async clickLogin() {
    await TestHelpers.clickAndWait(this.page, this.loginButton);
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  // Assertions
  async expectToBeOnLoginPage() {
    await TestHelpers.expectUrl(this.page, '/login');
    await TestHelpers.expectElementVisible(this.page, this.emailInput);
    await TestHelpers.expectElementVisible(this.page, this.passwordInput);
    await TestHelpers.expectElementVisible(this.page, this.loginButton);
  }

  async expectLoginError(errorText?: string) {
    await TestHelpers.expectElementVisible(this.page, this.errorMessage);
    if (errorText) {
      await TestHelpers.expectElementText(this.page, this.errorMessage, errorText);
    }
  }

  async expectSuccessfulLogin() {
    // Wait for church selection dialog to appear (this indicates successful login)
    const churchSelectionDialog = this.page.locator('text=Select a Church');
    await expect(churchSelectionDialog).toBeVisible({ timeout: 10000 });
    
    // Wait for the dialog to be fully loaded and stable
    await this.page.waitForLoadState('networkidle');
    
    // Try different church selection approaches
    let churchSelected = false;
    
    // First try clicking a clickable church button/link
    const churchButton = this.page.locator('button:has-text("Grace Community Church"), a:has-text("Grace Community Church")').first();
    if (await churchButton.isVisible({ timeout: 2000 })) {
      await churchButton.click();
      churchSelected = true;
    } else {
      // Try clicking the church text in a list item or div
      const churchListItem = this.page.locator('li:has-text("Grace Community Church"), div[role="button"]:has-text("Grace Community Church")').first();
      if (await churchListItem.isVisible({ timeout: 2000 })) {
        await churchListItem.click();
        churchSelected = true;
      } else {
        // Last resort: force click the text element
        const churchText = this.page.locator('text=Grace Community Church').first();
        if (await churchText.isVisible({ timeout: 2000 })) {
          await churchText.click({ force: true });
          churchSelected = true;
        }
      }
    }
    
    if (churchSelected) {
      // Wait for the dialog to be handled and page to redirect away from login
      await expect(this.page).not.toHaveURL(/\/login/, { timeout: 10000 });
      
      // Wait for page to stabilize after any redirects
      await TestHelpers.waitForPageLoad(this.page);
    } else {
      // If no church could be selected, just verify we're not on login anymore
      // This might happen if the app automatically selects a church
      await expect(this.page).not.toHaveURL(/\/login/, { timeout: 15000 });
    }
  }
}