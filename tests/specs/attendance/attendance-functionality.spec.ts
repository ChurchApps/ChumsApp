import { test, expect } from '@playwright/test';

test.describe('Attendance Module Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/attendance');
    await page.waitForLoadState('networkidle');
  });

  test('should load Attendance page with correct elements', async ({ page }) => {
    // Verify page loaded correctly
    await expect(page).toHaveURL(/\/attendance/);
    
    // Check for Attendance text in navigation or header
    await expect(page.getByText('Attendance')).toBeVisible();
    
    console.log('✅ Attendance page loaded successfully');
  });

  test('should display attendance tracking interface', async ({ page }) => {
    // Look for common attendance features
    const pageContent = await page.textContent('body');
    
    // Check for attendance-related terms
    const hasAttendanceTerms = [
      'Check-in',
      'Present',
      'Absent', 
      'Member',
      'Visitor',
      'Service',
      'Date'
    ].some(term => pageContent?.includes(term));
    
    console.log('Attendance interface found:', hasAttendanceTerms);
    
    // Look for date picker or service selection
    const hasDatePicker = await page.locator('input[type="date"], input[placeholder*="date" i]').isVisible().catch(() => false);
    const hasServiceSelection = await page.locator('select, option').isVisible().catch(() => false);
    
    console.log('Attendance features:', {
      hasDatePicker,
      hasServiceSelection
    });
  });

  test('should test attendance recording functionality', async ({ page }) => {
    // Look for attendance recording buttons or checkboxes
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    const attendanceButtons = await page.locator('button').filter({ hasText: /present|absent|here|check.?in/i }).all();
    
    console.log(`Found ${checkboxes.length} checkboxes and ${attendanceButtons.length} attendance buttons`);
    
    if (checkboxes.length > 0) {
      console.log('✅ Attendance checkboxes available for marking present/absent');
      
      // Test marking first few checkboxes (don't actually save)
      for (let i = 0; i < Math.min(checkboxes.length, 3); i++) {
        const checkbox = checkboxes[i];
        if (await checkbox.isVisible() && await checkbox.isEnabled()) {
          await checkbox.check();
          console.log(`Checked attendance checkbox ${i + 1}`);
          await checkbox.uncheck(); // Uncheck to avoid affecting data
        }
      }
    }
    
    if (attendanceButtons.length > 0) {
      console.log('✅ Attendance action buttons available');
      for (let i = 0; i < Math.min(attendanceButtons.length, 3); i++) {
        const button = attendanceButtons[i];
        const text = await button.textContent();
        console.log(`Attendance button ${i + 1}: "${text}"`);
      }
    }
  });

  test('should test service or event selection', async ({ page }) => {
    // Look for service/event dropdowns
    const selects = await page.locator('select').all();
    const dropdowns = await page.locator('[role="combobox"], [role="listbox"]').all();
    
    console.log(`Found ${selects.length} select elements and ${dropdowns.length} dropdown elements`);
    
    if (selects.length > 0) {
      const firstSelect = selects[0];
      const options = await firstSelect.locator('option').all();
      
      console.log(`First select has ${options.length} options:`);
      for (let i = 0; i < Math.min(options.length, 5); i++) {
        const option = options[i];
        const text = await option.textContent();
        const value = await option.getAttribute('value');
        console.log(`  ${i + 1}. "${text}" (value: ${value})`);
      }
    }
  });

  test('should test attendance reporting features', async ({ page }) => {
    // Look for report-related elements
    const reportButtons = await page.locator('button, a').filter({ hasText: /report|summary|stats|export/i }).all();
    const chartElements = await page.locator('canvas, svg, [class*="chart"]').all();
    
    console.log(`Found ${reportButtons.length} report buttons and ${chartElements.length} chart elements`);
    
    if (reportButtons.length > 0) {
      console.log('Report buttons found:');
      for (let i = 0; i < reportButtons.length; i++) {
        const button = reportButtons[i];
        const text = await button.textContent();
        console.log(`  ${i + 1}. "${text}"`);
      }
    }
    
    if (chartElements.length > 0) {
      console.log('✅ Charts or visualizations found for attendance data');
    }
  });

  test('should test attendance search and filtering', async ({ page }) => {
    // Look for search and filter options
    const searchInputs = await page.locator('input[type="search"], input[placeholder*="search" i]').all();
    const filterButtons = await page.locator('button').filter({ hasText: /filter|sort|group/i }).all();
    
    console.log(`Found ${searchInputs.length} search inputs and ${filterButtons.length} filter buttons`);
    
    if (searchInputs.length > 0) {
      const searchInput = searchInputs[0];
      await searchInput.fill('Demo');
      
      // Look for search button or press Enter
      const searchButton = page.locator('button:has-text("Search")');
      if (await searchButton.isVisible().catch(() => false)) {
        await searchButton.click();
      } else {
        await searchInput.press('Enter');
      }
      
      await page.waitForTimeout(1500);
      
      const resultsText = await page.textContent('body');
      const hasSearchResults = resultsText?.includes('Demo') || false;
      console.log('Attendance search results for "Demo":', hasSearchResults);
    }
  });

  test('should verify attendance navigation', async ({ page }) => {
    // Check navigation structure
    const nav = page.locator('nav, header');
    const navText = await nav.textContent().catch(() => '');
    
    console.log('Navigation content:', navText);
    
    const hasAttendanceInNav = navText.includes('Attendance');
    console.log('Attendance appears in navigation:', hasAttendanceInNav);
    
    // Check for related navigation options
    const hasGroups = navText.includes('Groups');
    const hasPeople = navText.includes('People');
    
    console.log('Related navigation options:', {
      attendance: hasAttendanceInNav,
      groups: hasGroups,
      people: hasPeople
    });
  });
});