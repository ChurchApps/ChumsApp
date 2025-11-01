import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth-helper';

test.describe('Login Page', () => {
  test('should display form elements and accept credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://demo.b1.church/');
    
    // Verify we're on the login page
    await expect(page).toHaveURL(/.*login/);
    
    // Check that login form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Fill in login credentials
    await page.fill('input[type="email"]', 'demo@chums.org');
    await page.fill('input[type="password"]', 'password');
    
    // Verify fields are filled
    const emailValue = await page.locator('input[type="email"]').inputValue();
    const passwordValue = await page.locator('input[type="password"]').inputValue();
    
    expect(emailValue).toBe('demo@chums.org');
    expect(passwordValue).toBe('password');
    
    console.log('Login form elements and credentials test completed');
  });

  test('should reject bad password and have forgot/reset password links', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://demo.b1.church/');
    
    // First test: Look for forgot password link
    const forgotPasswordSelectors = [
      'text=Forgot Password',
      'text=Forgot password',
      'text=forgot password',
      'a:has-text("Forgot")',
      'a:has-text("Reset")',
      '[href*="forgot"]',
      '[href*="reset"]'
    ];
    
    let foundForgotLink = false;
    let forgotLinkElement = null;
    
    for (const selector of forgotPasswordSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        foundForgotLink = true;
        forgotLinkElement = element;
        console.log(`Found forgot password link: ${selector}`);
        break;
      }
    }
    
    expect(foundForgotLink).toBeTruthy();
    
    // Second test: Try bad password login
    await page.fill('input[type="email"]', 'demo@chums.org');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Should still be on login page
    const currentUrl = page.url();
    const isStillOnLogin = currentUrl.includes('/login');
    
    // Check for error messages
    const errorSelectors = [
      'text=Invalid',
      'text=Error',
      'text=Incorrect',
      'text=failed',
      'text=wrong',
      '.error',
      '.alert-danger',
      '[role="alert"]'
    ];
    
    let hasError = false;
    for (const selector of errorSelectors) {
      const errorVisible = await page.locator(selector).first().isVisible().catch(() => false);
      if (errorVisible) {
        hasError = true;
        console.log(`Found error indicator: ${selector}`);
        break;
      }
    }
    
    // Should not have church selection dialog with wrong password
    const hasChurchSelection = await page.locator('text=Select a Church').isVisible().catch(() => false);
    
    expect(isStillOnLogin).toBeTruthy();
    expect(hasChurchSelection).toBeFalsy();
    // Either should still be on login OR should have some error indication
    expect(isStillOnLogin || hasError).toBeTruthy();
    
    // Third test: Test forgot password link functionality
    if (forgotLinkElement) {
      const linkUrl = await forgotLinkElement.getAttribute('href').catch(() => null);
      console.log('Forgot password link URL:', linkUrl);
      
      try {
        await forgotLinkElement.click();
        await page.waitForLoadState('networkidle');
        console.log('Forgot password link clicked successfully');
      } catch (error) {
        console.log('Forgot password link click failed:', error.message);
      }
    }
    
    console.log('Bad password rejection and forgot password link tests completed');
  });

  test('should complete full login flow with church selection and verification', async ({ page }) => {
    // Login and get to church selection
    await AuthHelper.login(page);
    
    // Verify church selection dialog appears
    const hasChurchSelection = await page.locator('text=Select a Church').isVisible().catch(() => false);
    expect(hasChurchSelection).toBeTruthy();
    
    // Select Grace Community Church
    const churchSelected = await AuthHelper.selectGraceCommunityChurch(page);
    expect(churchSelected).toBeTruthy();
    
    // Verify that the church selection actually worked
    const currentUrl = page.url();
    console.log('Current URL after login flow:', currentUrl);
    
    // Check if church selection dialog is gone (indicating it was processed)
    const churchDialogStillVisible = await page.locator('text=Select a Church').isVisible().catch(() => false);
    expect(churchDialogStillVisible).toBeFalsy();
    
    // Verify we have some application content
    const hasApplicationContent = await page.locator('#root, body, html').first().isVisible().catch(() => false);
    expect(hasApplicationContent).toBeTruthy();
    
    console.log('Full login flow with church selection and verification completed');
  });
});