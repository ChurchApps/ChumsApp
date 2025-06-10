import { test, expect } from '@playwright/test';

test.describe('Debug Login Page', () => {
  test('should access login page and log form elements', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Give React time to render
    
    console.log('Page URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Try to find any input elements
    const inputs = await page.locator('input').all();
    console.log('Found inputs:', inputs.length);
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type').catch(() => 'unknown');
      const name = await input.getAttribute('name').catch(() => 'unknown');
      const placeholder = await input.getAttribute('placeholder').catch(() => 'unknown');
      const id = await input.getAttribute('id').catch(() => 'unknown');
      console.log(`Input ${i}: type=${type}, name=${name}, placeholder=${placeholder}, id=${id}`);
    }
    
    // Try to find any buttons
    const buttons = await page.locator('button').all();
    console.log('Found buttons:', buttons.length);
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent().catch(() => 'unknown');
      const type = await button.getAttribute('type').catch(() => 'unknown');
      console.log(`Button ${i}: text="${text}", type=${type}`);
    }
    
    // Check if there's a demo alert
    const demoAlert = page.locator('text=Demo: This is the demo environment');
    if (await demoAlert.isVisible().catch(() => false)) {
      console.log('Demo alert found!');
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/debug-login-page.png', fullPage: true });
    
    // Just verify we got to a page with some content
    await expect(page.locator('body')).toBeVisible();
  });
});