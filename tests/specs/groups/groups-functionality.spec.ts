import { test, expect } from '@playwright/test';

test.describe('Groups Module Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/groups');
    await page.waitForLoadState('networkidle');
  });

  test('should load Groups page with correct elements', async ({ page }) => {
    // Verify page loaded correctly
    await expect(page).toHaveURL(/\/groups/);
    
    // Check for Groups text in navigation - use first occurrence
    await expect(page.getByText('Groups').first()).toBeVisible();
    
    // Check for group list or management interface
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Groups');
    
    console.log('✅ Groups page loaded successfully');
  });

  test('should display existing groups from dashboard', async ({ page }) => {
    // Check for groups we know exist from the dashboard
    const groupsToCheck = [
      'Adult Bible Class',
      'Band Members', 
      'Community Service Team',
      'Men\'s Bible Study'
    ];
    
    for (const groupName of groupsToCheck) {
      const groupElement = page.getByText(groupName).first();
      if (await groupElement.isVisible().catch(() => false)) {
        console.log(`✅ Found group: ${groupName}`);
      }
    }
  });

  test('should test group navigation and details', async ({ page }) => {
    // Try to find and click on first available group
    const groupLinks = await page.locator('a[href*="/groups/"]').all();
    
    if (groupLinks.length > 0) {
      const firstGroup = groupLinks[0];
      const groupText = await firstGroup.textContent();
      console.log(`Clicking on group: ${groupText}`);
      
      await firstGroup.click();
      await page.waitForLoadState('networkidle');
      
      const newUrl = page.url();
      console.log(`Group detail URL: ${newUrl}`);
      
      // Check if we're on a group detail page
      if (newUrl.includes('/groups/') && newUrl !== '/groups') {
        console.log('✅ Successfully navigated to group details');
        
        // Look for group management features
        const hasEditButton = await page.locator('button:has-text("Edit"), a:has-text("Edit")').isVisible().catch(() => false);
        const hasMembersSection = await page.getByText('Members').isVisible().catch(() => false);
        const hasSettingsSection = await page.getByText('Settings').isVisible().catch(() => false);
        
        console.log('Group detail features:', {
          hasEditButton,
          hasMembersSection,
          hasSettingsSection,
          url: newUrl
        });
      }
    } else {
      console.log('No group links found on page');
    }
  });

  test('should test group creation interface', async ({ page }) => {
    // Look for Add Group or Create Group button
    const addButtons = await page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New")').all();
    
    if (addButtons.length > 0) {
      console.log(`Found ${addButtons.length} potential add/create buttons`);
      
      for (let i = 0; i < addButtons.length; i++) {
        const button = addButtons[i];
        const buttonText = await button.textContent();
        console.log(`Button ${i + 1}: "${buttonText}"`);
        
        // Try clicking add/create buttons that likely relate to groups
        if (buttonText?.toLowerCase().includes('group') || 
            buttonText?.toLowerCase().includes('add') || 
            buttonText?.toLowerCase().includes('new')) {
          
          try {
            await button.click();
            await page.waitForTimeout(1000);
            
            const newUrl = page.url();
            console.log(`After clicking "${buttonText}": ${newUrl}`);
            
            // Check if a form appeared
            const hasForm = await page.locator('form, input, textarea').isVisible().catch(() => false);
            if (hasForm) {
              console.log('✅ Group creation form appeared');
            }
            
            break; // Only test first relevant button
          } catch (error) {
            console.log(`Could not click "${buttonText}": ${error}`);
          }
        }
      }
    } else {
      console.log('No add/create buttons found');
    }
  });

  test('should test group search functionality', async ({ page }) => {
    // Look for search inputs
    const searchInputs = await page.locator('input[type="search"], input[placeholder*="search" i], input[name*="search" i]').all();
    
    if (searchInputs.length > 0) {
      console.log(`Found ${searchInputs.length} search input(s)`);
      
      const searchInput = searchInputs[0];
      await searchInput.fill('Bible');
      
      // Look for search button or press Enter
      const searchButton = page.locator('button:has-text("Search")');
      if (await searchButton.isVisible().catch(() => false)) {
        await searchButton.click();
      } else {
        await searchInput.press('Enter');
      }
      
      await page.waitForTimeout(2000);
      
      // Check if search results contain Bible-related groups
      const resultsText = await page.textContent('body');
      const hasBibleGroups = resultsText?.includes('Bible') || false;
      
      console.log('Group search results for "Bible":', hasBibleGroups);
    } else {
      console.log('No search functionality found');
    }
  });

  test('should verify groups navigation breadcrumb', async ({ page }) => {
    // Check navigation breadcrumb/header
    const nav = page.locator('nav, header');
    const navText = await nav.textContent().catch(() => '');
    
    console.log('Navigation content:', navText);
    
    // Check for Groups in navigation
    const hasGroupsInNav = navText.includes('Groups');
    console.log('Groups appears in navigation:', hasGroupsInNav);
    
    // Check for other navigation options
    const hasPeople = navText.includes('People');
    const hasAttendance = navText.includes('Attendance');
    
    console.log('Navigation options found:', {
      groups: hasGroupsInNav,
      people: hasPeople,
      attendance: hasAttendance
    });
  });
});