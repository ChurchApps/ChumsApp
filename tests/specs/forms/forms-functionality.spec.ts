import { test, expect } from '@playwright/test';

test.describe('Forms Module Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forms');
    await page.waitForLoadState('networkidle');
  });

  test('should load Forms page with correct elements', async ({ page }) => {
    // Verify page loaded correctly
    await expect(page).toHaveURL(/\/forms/);
    
    // Check for Forms text in navigation
    await expect(page.getByText('Forms')).toBeVisible();
    
    console.log('✅ Forms page loaded successfully');
  });

  test('should display forms management interface', async ({ page }) => {
    const pageContent = await page.textContent('body');
    
    // Check for forms-related terms
    const formsTerms = [
      'Form',
      'Create',
      'Builder',
      'Template',
      'Response',
      'Submission',
      'Field'
    ];
    
    const foundTerms = formsTerms.filter(term => pageContent?.includes(term));
    console.log('Forms terms found:', foundTerms);
    
    // Look for form creation/management buttons
    const createButtons = await page.locator('button:has-text("Create"), button:has-text("New"), button:has-text("Add")').all();
    console.log(`Found ${createButtons.length} create/add buttons`);
    
    if (createButtons.length > 0) {
      console.log('Form creation buttons:');
      for (let i = 0; i < createButtons.length; i++) {
        const button = createButtons[i];
        const text = await button.textContent();
        console.log(`  ${i + 1}. "${text}"`);
      }
    }
  });

  test('should test form builder functionality', async ({ page }) => {
    // Look for form builder or create form functionality
    const createFormButton = page.locator('button:has-text("Create"), button:has-text("New Form"), button:has-text("Form Builder")');
    
    if (await createFormButton.isVisible().catch(() => false)) {
      console.log('Found form creation button, testing form builder');
      await createFormButton.click();
      await page.waitForTimeout(2000);
      
      const newUrl = page.url();
      console.log(`Form builder URL: ${newUrl}`);
      
      // Look for form builder elements
      const formElements = await page.locator('input, textarea, select, button').all();
      const dragDropElements = await page.locator('[draggable="true"], [class*="drag"], [class*="drop"]').all();
      
      console.log(`Form builder has ${formElements.length} form elements and ${dragDropElements.length} drag-drop elements`);
      
      if (formElements.length > 5) {
        console.log('✅ Form builder interface loaded with form elements');
      }
    } else {
      console.log('No form creation button found');
    }
  });

  test('should test existing forms list', async ({ page }) => {
    // Look for existing forms
    const formsList = await page.locator('table, [role="table"], [class*="list"], [class*="grid"]').all();
    const formLinks = await page.locator('a[href*="form"]').all();
    
    console.log(`Found ${formsList.length} list/table elements and ${formLinks.length} form links`);
    
    if (formLinks.length > 0) {
      console.log('Existing forms found:');
      for (let i = 0; i < Math.min(formLinks.length, 5); i++) {
        const link = formLinks[i];
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        console.log(`  ${i + 1}. "${text}" -> ${href}`);
      }
      
      // Try clicking on first form to see details
      const firstForm = formLinks[0];
      await firstForm.click();
      await page.waitForLoadState('networkidle');
      
      const formDetailUrl = page.url();
      console.log(`Form detail URL: ${formDetailUrl}`);
      
      if (formDetailUrl !== '/forms') {
        console.log('✅ Successfully navigated to form details');
      }
    }
  });

  test('should test form responses and submissions', async ({ page }) => {
    // Look for responses/submissions functionality
    const responseButtons = await page.locator('button, a').filter({ hasText: /response|submission|result|data/i }).all();
    const exportButtons = await page.locator('button, a').filter({ hasText: /export|download|csv/i }).all();
    
    console.log(`Found ${responseButtons.length} response buttons and ${exportButtons.length} export buttons`);
    
    if (responseButtons.length > 0) {
      console.log('Form response options:');
      for (let i = 0; i < responseButtons.length; i++) {
        const button = responseButtons[i];
        const text = await button.textContent();
        console.log(`  ${i + 1}. "${text}"`);
      }
    }
    
    if (exportButtons.length > 0) {
      console.log('✅ Form data export functionality available');
    }
  });

  test('should test form templates', async ({ page }) => {
    // Look for template functionality
    const templateButtons = await page.locator('button, a').filter({ hasText: /template|sample|example/i }).all();
    const templateElements = await page.locator('[class*="template"], [id*="template"]').all();
    
    console.log(`Found ${templateButtons.length} template buttons and ${templateElements.length} template elements`);
    
    if (templateButtons.length > 0) {
      console.log('Template options found:');
      for (let i = 0; i < templateButtons.length; i++) {
        const button = templateButtons[i];
        const text = await button.textContent();
        console.log(`  ${i + 1}. "${text}"`);
      }
    }
  });

  test('should test form search and filtering', async ({ page }) => {
    const searchInputs = await page.locator('input[type="search"], input[placeholder*="search" i]').all();
    const filterButtons = await page.locator('button').filter({ hasText: /filter|sort|category/i }).all();
    
    console.log(`Found ${searchInputs.length} search inputs and ${filterButtons.length} filter options`);
    
    if (searchInputs.length > 0) {
      const searchInput = searchInputs[0];
      await searchInput.fill('contact'); // Search for contact forms
      
      const searchButton = page.locator('button:has-text("Search")');
      if (await searchButton.isVisible().catch(() => false)) {
        await searchButton.click();
      } else {
        await searchInput.press('Enter');
      }
      
      await page.waitForTimeout(1500);
      console.log('Performed search for "contact"');
    }
  });

  test('should verify forms navigation', async ({ page }) => {
    const nav = page.locator('nav, header');
    const navText = await nav.textContent().catch(() => '');
    
    console.log('Navigation content:', navText);
    
    const hasFormsInNav = navText.includes('Forms');
    console.log('Forms appears in navigation:', hasFormsInNav);
    
    // Check for settings integration (forms are often part of settings)
    const hasSettings = navText.includes('Settings');
    
    console.log('Navigation sections:', {
      forms: hasFormsInNav,
      settings: hasSettings
    });
  });
});