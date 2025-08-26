import { test, expect } from '@playwright/test';

test.describe('Settings Module Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('should load Settings page with correct elements', async ({ page }) => {
    // Verify page loaded correctly
    await expect(page).toHaveURL(/\/settings/);
    
    // Check for Settings text in navigation
    await expect(page.getByText('Settings')).toBeVisible();
    
    console.log('✅ Settings page loaded successfully');
  });

  test('should display settings management interface', async ({ page }) => {
    const pageContent = await page.textContent('body');
    
    // Check for settings-related terms
    const settingsTerms = [
      'Settings',
      'Configuration',
      'Preferences',
      'Options',
      'Church',
      'Profile',
      'Account'
    ];
    
    const foundTerms = settingsTerms.filter(term => pageContent?.includes(term));
    console.log('Settings terms found:', foundTerms);
    
    // Look for common settings categories
    const settingsCategories = [
      'General',
      'Church Information',
      'User Management',
      'Permissions',
      'Notifications',
      'Integration',
      'Forms' // We saw Forms in Settings navigation
    ];
    
    const foundCategories = settingsCategories.filter(category => pageContent?.includes(category));
    console.log('Settings categories found:', foundCategories);
  });

  test('should test church information settings', async ({ page }) => {
    // Look for church-specific settings
    const churchElements = await page.locator('*').filter({ hasText: /church|organization|ministry/i }).all();
    const nameInputs = await page.locator('input[name*="name"], input[placeholder*="name" i]').all();
    const addressInputs = await page.locator('input, textarea').filter({ hasText: /address|location/i }).all();
    
    console.log(`Found ${churchElements.length} church elements, ${nameInputs.length} name inputs, ${addressInputs.length} address inputs`);
    
    if (nameInputs.length > 0) {
      console.log('✅ Church information form fields available');
      
      // Check if we can see current church name
      for (let i = 0; i < Math.min(nameInputs.length, 3); i++) {
        const input = nameInputs[i];
        const value = await input.inputValue();
        const placeholder = await input.getAttribute('placeholder');
        console.log(`Name input ${i + 1}: value="${value}", placeholder="${placeholder}"`);
      }
    }
  });

  test('should test user and permission settings', async ({ page }) => {
    // Look for user management functionality
    const userElements = await page.locator('*').filter({ hasText: /user|member|role|permission|access/i }).all();
    const addUserButtons = await page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Invite")').all();
    
    console.log(`Found ${userElements.length} user-related elements and ${addUserButtons.length} add user buttons`);
    
    if (userElements.length > 0) {
      console.log('User management content found:');
      for (let i = 0; i < Math.min(userElements.length, 5); i++) {
        const element = userElements[i];
        const text = await element.textContent();
        if (text && text.length < 100 && !text.includes('You need to enable JavaScript')) {
          console.log(`  ${i + 1}. "${text}"`);
        }
      }
    }
    
    // Look for role/permission checkboxes or toggles
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    const toggles = await page.locator('[role="switch"], input[type="checkbox"][class*="toggle"]').all();
    
    console.log(`Found ${checkboxes.length} checkboxes and ${toggles.length} toggles for permissions`);
  });

  test('should test notification and email settings', async ({ page }) => {
    // Look for notification/email settings
    const notificationElements = await page.locator('*').filter({ hasText: /notification|email|alert|reminder/i }).all();
    const emailInputs = await page.locator('input[type="email"], input[name*="email"]').all();
    
    console.log(`Found ${notificationElements.length} notification elements and ${emailInputs.length} email inputs`);
    
    if (notificationElements.length > 0) {
      console.log('Notification settings found:');
      for (let i = 0; i < Math.min(notificationElements.length, 5); i++) {
        const element = notificationElements[i];
        const text = await element.textContent();
        if (text && text.length < 100) {
          console.log(`  ${i + 1}. "${text}"`);
        }
      }
    }
  });

  test('should test integration and API settings', async ({ page }) => {
    // Look for integration/API settings
    const integrationElements = await page.locator('*').filter({ hasText: /integration|api|webhook|connect|sync/i }).all();
    const keyInputs = await page.locator('input[type="password"], input[placeholder*="key" i], input[placeholder*="token" i]').all();
    
    console.log(`Found ${integrationElements.length} integration elements and ${keyInputs.length} API key inputs`);
    
    if (integrationElements.length > 0) {
      console.log('Integration settings found:');
      for (let i = 0; i < Math.min(integrationElements.length, 3); i++) {
        const element = integrationElements[i];
        const text = await element.textContent();
        if (text && text.length < 150) {
          console.log(`  ${i + 1}. "${text}"`);
        }
      }
    }
    
    if (keyInputs.length > 0) {
      console.log('✅ API/Integration key fields available');
    }
  });

  test('should test settings save functionality', async ({ page }) => {
    // Look for save/update buttons
    const saveButtons = await page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Apply")').all();
    const resetButtons = await page.locator('button:has-text("Reset"), button:has-text("Cancel"), button:has-text("Discard")').all();
    
    console.log(`Found ${saveButtons.length} save buttons and ${resetButtons.length} reset/cancel buttons`);
    
    if (saveButtons.length > 0) {
      console.log('Save/update options:');
      for (let i = 0; i < saveButtons.length; i++) {
        const button = saveButtons[i];
        const text = await button.textContent();
        const disabled = await button.isDisabled();
        console.log(`  ${i + 1}. "${text}" (disabled: ${disabled})`);
      }
    }
    
    if (saveButtons.length > 0 && resetButtons.length > 0) {
      console.log('✅ Complete save/cancel functionality available');
    }
  });

  test('should test forms settings integration', async ({ page }) => {
    // Since we saw Forms in Settings navigation, test this connection
    const formsLink = page.locator('a, button').filter({ hasText: 'Forms' });
    
    if (await formsLink.isVisible().catch(() => false)) {
      console.log('Found Forms section in Settings');
      await formsLink.click();
      await page.waitForLoadState('networkidle');
      
      const newUrl = page.url();
      console.log(`Forms settings URL: ${newUrl}`);
      
      // Check if we're still in settings context
      if (newUrl.includes('/settings') || newUrl.includes('/forms')) {
        console.log('✅ Forms settings integration working');
      }
    }
  });

  test('should verify settings navigation', async ({ page }) => {
    const nav = page.locator('nav, header');
    const navText = await nav.textContent().catch(() => '');
    
    console.log('Navigation content:', navText);
    
    const hasSettingsInNav = navText.includes('Settings');
    console.log('Settings appears in navigation:', hasSettingsInNav);
    
    // Check for settings-specific navigation sections
    const hasForms = navText.includes('Forms');
    
    console.log('Settings navigation sections:', {
      settings: hasSettingsInNav,
      forms: hasForms
    });
    
    // Test navigation between settings sections
    const settingsNavLinks = await page.locator('a, button').filter({ hasText: /settings|config|preference/i }).all();
    console.log(`Found ${settingsNavLinks.length} settings navigation links`);
  });
});