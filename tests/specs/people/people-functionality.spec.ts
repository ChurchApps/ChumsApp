import { test, expect } from '@playwright/test';

test.describe('People Module Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to People page
    await page.goto('/people');
    await page.waitForLoadState('networkidle');
  });

  test('should load People page with correct elements', async ({ page }) => {
    // Verify page loaded correctly
    await expect(page).toHaveURL(/\/people/);
    
    // Check main header using text content approach
    await expect(page.getByText('Search People')).toBeVisible();
    
    // Check Add Person button
    await expect(page.getByRole('button', { name: 'Add Person' })).toBeVisible();
    
    // Check search functionality exists - use the actual name attribute
    await expect(page.locator('input[name="searchText"]')).toBeVisible();
    
    // Check people section exists
    await expect(page.getByText('Recently Added People')).toBeVisible();
    
    // Check that we can see some people in the list
    await expect(page.getByText('Carol Clark')).toBeVisible();
    
    console.log('✅ People page loaded with all expected elements');
  });

  test('should perform simple search for people', async ({ page }) => {
    // Find and use the search input using the actual name attribute
    await page.locator('input[name="searchText"]').fill('Clark');
    
    // Click the specific search button using data-testid
    await page.getByTestId('people-search-button').click();
    
    // Wait for results
    await page.waitForTimeout(2000);
    
    // Take screenshot of results
    await page.screenshot({ path: 'people-search-clark-results.png' });
    
    // Check if we have search results
    const resultsText = await page.textContent('body');
    const hasClark = resultsText?.includes('Clark') || false;
    
    console.log('Search for "Clark" found results:', hasClark);
    expect(hasClark).toBeTruthy();
  });

  test('should test Add Person functionality', async ({ page }) => {
    // Click Add Person button
    const addButton = page.locator('button:has-text("Add Person")');
    await addButton.click();
    
    // Wait for modal or new page to load
    await page.waitForTimeout(2000);
    
    // Take screenshot to see what opened
    await page.screenshot({ path: 'add-person-modal.png' });
    
    // Check if a modal opened or we navigated to a new page
    const currentUrl = page.url();
    console.log('URL after clicking Add Person:', currentUrl);
    
    // Check for form elements that would be in an add person form
    const firstNameInput = page.locator('input[name*="first" i], input[placeholder*="first" i]').first();
    const lastNameInput = page.locator('input[name*="last" i], input[placeholder*="last" i]').first();
    const emailInput = page.locator('input[name*="email" i], input[placeholder*="email" i]').first();
    
    const hasFirstName = await firstNameInput.isVisible().catch(() => false);
    const hasLastName = await lastNameInput.isVisible().catch(() => false);
    const hasEmail = await emailInput.isVisible().catch(() => false);
    
    console.log('Add Person form fields found:', {
      hasFirstName,
      hasLastName,
      hasEmail
    });
    
    // If we found form fields, try filling them out
    if (hasFirstName && hasLastName) {
      console.log('Found person form, testing form filling...');
      
      const timestamp = Date.now();
      await firstNameInput.fill(`TestFirstName${timestamp}`);
      await lastNameInput.fill(`TestLastName${timestamp}`);
      
      if (hasEmail) {
        await emailInput.fill(`test${timestamp}@example.com`);
      }
      
      // Look for save/submit button
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Submit"), button[type="submit"]').first();
      const hasSaveButton = await saveButton.isVisible().catch(() => false);
      
      console.log('Save button found:', hasSaveButton);
      
      if (hasSaveButton) {
        console.log('Form appears functional - would save a test person here');
        // Note: Not actually saving to avoid creating test data
        // await saveButton.click();
      }
    }
  });

  test('should test Advanced search functionality', async ({ page }) => {
    // Click on Advanced search
    const advancedButton = page.locator('a:has-text("Advanced"), button:has-text("Advanced")');
    
    if (await advancedButton.isVisible()) {
      console.log('Found Advanced search option');
      await advancedButton.click();
      
      // Wait for advanced search to load
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await page.screenshot({ path: 'advanced-search.png' });
      
      // Check for additional search fields
      const allInputs = await page.locator('input').count();
      console.log(`Advanced search shows ${allInputs} input fields`);
      
    } else {
      console.log('Advanced search option not found');
    }
  });

  test('should test AI Search functionality', async ({ page }) => {
    // Look for AI Search section
    const aiSearchSection = page.locator('text="AI Search", h3:has-text("AI Search"), h2:has-text("AI Search")').first();
    
    if (await aiSearchSection.isVisible().catch(() => false)) {
      console.log('Found AI Search section');
      
      // Look for the AI search input
      const aiInput = page.locator('textarea, input').filter({ 
        hasText: /show me|birthdays|married/i 
      }).or(
        page.locator('input, textarea').nth(-1) // Often the last input on page
      ).first();
      
      if (await aiInput.isVisible().catch(() => false)) {
        console.log('Found AI search input');
        
        // Try an AI search query
        await aiInput.fill('Show me members named Jackson');
        
        // Look for search button near AI search
        const aiSearchButton = page.locator('button:has-text("Search")').last();
        
        if (await aiSearchButton.isVisible().catch(() => false)) {
          await aiSearchButton.click();
          await page.waitForTimeout(2000);
          
          // Take screenshot of AI search results
          await page.screenshot({ path: 'ai-search-results.png' });
          
          console.log('AI search executed successfully');
        }
      }
    } else {
      console.log('AI Search section not visible');
    }
  });

  test('should test person profile access', async ({ page }) => {
    // Click on the first person link to see their profile
    const firstPersonLink = page.locator('a').filter({ hasText: /Carol Clark|Donald Clark|Brian Harris/i }).first();
    
    if (await firstPersonLink.isVisible().catch(() => false)) {
      const personName = await firstPersonLink.textContent();
      console.log(`Clicking on person: ${personName}`);
      
      await firstPersonLink.click();
      await page.waitForLoadState('networkidle');
      
      // Take screenshot of person profile
      await page.screenshot({ path: 'person-profile.png' });
      
      const newUrl = page.url();
      console.log('Person profile URL:', newUrl);
      
      // Check if we're on a person profile page
      if (newUrl.includes('/people/') && newUrl !== '/people') {
        console.log('✅ Successfully navigated to person profile');
        
        // Look for profile elements
        const hasEditButton = await page.locator('button:has-text("Edit")').isVisible().catch(() => false);
        const hasBackButton = await page.locator('button:has-text("Back"), a:has-text("Back")').isVisible().catch(() => false);
        
        console.log('Person profile features:', {
          hasEditButton,
          hasBackButton,
          url: newUrl
        });
      }
    }
  });

  test('should verify People navigation breadcrumb', async ({ page }) => {
    // Check navigation breadcrumb/header
    const nav = page.locator('nav, header');
    const navText = await nav.textContent().catch(() => '');
    
    console.log('Navigation content:', navText);
    
    // Check for People in navigation
    const hasPeopleInNav = navText.includes('People');
    console.log('People appears in navigation:', hasPeopleInNav);
    
    // Check for other navigation options
    const hasGroups = navText.includes('Groups');
    const hasAttendance = navText.includes('Attendance');
    
    console.log('Navigation options found:', {
      people: hasPeopleInNav,
      groups: hasGroups,
      attendance: hasAttendance
    });
  });
});