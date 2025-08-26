import { test as setup, expect } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  console.log('Starting authentication...');
  
  // Navigate to the application
  await page.goto('/');
  
  // Wait for the login page to load
  await page.waitForLoadState('networkidle');
  console.log('Login page loaded');
  
  // Wait for email input to be visible
  await page.waitForSelector('input[name="email"]', { state: 'visible' });
  
  // Clear and fill email field properly
  const emailInput = page.locator('input[name="email"]');
  await emailInput.click({ clickCount: 3 }); // Select all
  await emailInput.press('Delete');
  await emailInput.fill('demo@chums.org');
  
  // Clear and fill password field properly  
  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.click({ clickCount: 3 }); // Select all
  await passwordInput.press('Delete');
  await passwordInput.fill('password');
  
  console.log('Filled credentials: demo@chums.org / password');
  
  // Click submit button
  await page.click('button[type="submit"]');
  
  // Wait for navigation or church selection
  await page.waitForTimeout(3000);
  
  console.log('Current URL after login attempt:', page.url());
  
  // Check if login was successful by looking for error message
  const errorVisible = await page.locator('[role="alert"]:has-text("Invalid login")').isVisible().catch(() => false);
  
  if (errorVisible) {
    const errorText = await page.locator('[role="alert"]:has-text("Invalid login")').textContent();
    console.log('Login error:', errorText);
    throw new Error(`Login failed: ${errorText}`);
  }
  
  // Check for church selection or success
  const currentUrl = page.url();
  console.log('Checking current URL:', currentUrl);
  
  // Wait for church selection modal to appear
  try {
    console.log('Looking for church selection modal...');
    
    // Wait for the church selection modal
    await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 10000 });
    console.log('Church selection modal appeared');
    
    // Wait for Grace Community Church to be visible in the modal (use heading role)
    const graceOption = page.locator('[role="dialog"] h3:has-text("Grace Community Church")');
    await graceOption.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Grace Community Church option found');
    
    // Click on Grace Community Church
    await graceOption.click();
    console.log('Clicked Grace Community Church');
    
    // The modal should close and navigate us to the main app
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });
    console.log('Successfully navigated away from login page');
    
  } catch (error) {
    console.log('Error during church selection:', error);
    
    // If the error is just the URL callback type issue, that's OK - the click might have worked
    if (error.message && error.message.includes('url.includes is not a function')) {
      console.log('URL callback error - this is expected, continuing...');
    } else {
      // Only try fallback for other errors
      const graceOption = page.locator('h3:has-text("Grace Community Church")');
      if (await graceOption.isVisible().catch(() => false)) {
        console.log('Found Grace Community Church heading, clicking...');
        await graceOption.click().catch(() => console.log('Click failed - element may have been removed'));
      }
    }
  }
  
  // Wait for final navigation
  await page.waitForTimeout(5000);
  
  // Check if we're successfully logged in
  const finalUrl = page.url();
  console.log('Final URL:', finalUrl);
  
  // Look for signs of successful login (navigation elements)
  const peopleLink = await page.locator('a[href="/people"]').isVisible().catch(() => false);
  const menuButton = await page.locator('[aria-label="Menu"]').isVisible().catch(() => false);
  const navElement = await page.locator('nav').isVisible().catch(() => false);
  const headerElement = await page.locator('header').isVisible().catch(() => false);
  
  console.log('Login success indicators:', {
    peopleLink,
    menuButton,
    navElement,
    headerElement,
    finalUrl,
  });
  
  if (!peopleLink && !menuButton && !navElement && !headerElement) {
    console.log('Taking screenshot for debugging...');
    await page.screenshot({ path: 'auth-failure-debug.png' });
    throw new Error('Login appears to have failed - no navigation elements found');
  }
  
  // Save storage state for reuse in tests
  await page.context().storageState({ path: authFile });
  
  console.log('Authentication completed successfully, state saved to:', authFile);
});