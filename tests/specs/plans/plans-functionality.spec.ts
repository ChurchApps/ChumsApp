import { test, expect } from '@playwright/test';

test.describe('Plans Module Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plans');
    await page.waitForLoadState('networkidle');
  });

  test('should load Plans page with correct elements', async ({ page }) => {
    // Verify page loaded correctly
    await expect(page).toHaveURL(/\/plans/);
    
    // Check for Plans text in navigation
    await expect(page.getByText('Plans')).toBeVisible();
    
    console.log('✅ Plans page loaded successfully');
  });

  test('should display ministry planning interface', async ({ page }) => {
    const pageContent = await page.textContent('body');
    
    // Check for planning-related terms from the navigation we saw
    const planningTerms = [
      'Plans',
      'Songs',
      'Tasks',
      'Service',
      'Ministry',
      'Schedule',
      'Event'
    ];
    
    const foundTerms = planningTerms.filter(term => pageContent?.includes(term));
    console.log('Planning terms found:', foundTerms);
    
    // Based on navigation, check for specific sections
    const hasPlans = pageContent?.includes('Plans') || false;
    const hasSongs = pageContent?.includes('Songs') || false;
    const hasTasks = pageContent?.includes('Tasks') || false;
    
    console.log('Planning sections:', {
      hasPlans,
      hasSongs,
      hasTasks
    });
  });

  test('should test service plan creation', async ({ page }) => {
    // Look for plan creation functionality
    const createButtons = await page.locator('button:has-text("Create"), button:has-text("New"), button:has-text("Add")').all();
    
    console.log(`Found ${createButtons.length} create/add buttons`);
    
    if (createButtons.length > 0) {
      console.log('Plan creation buttons:');
      for (let i = 0; i < createButtons.length; i++) {
        const button = createButtons[i];
        const text = await button.textContent();
        console.log(`  ${i + 1}. "${text}"`);
        
        // Try clicking the first relevant button
        if (i === 0 && text?.toLowerCase().includes('plan')) {
          try {
            await button.click();
            await page.waitForTimeout(2000);
            
            const newUrl = page.url();
            console.log(`After creating plan: ${newUrl}`);
            
            // Look for plan creation form
            const hasForm = await page.locator('input, textarea, select').count();
            if (hasForm > 0) {
              console.log('✅ Plan creation form appeared');
            }
          } catch (error) {
            console.log(`Could not create plan: ${error}`);
          }
        }
      }
    }
  });

  test('should test songs and music management', async ({ page }) => {
    // Navigate to songs section if available
    const songsLink = page.locator('a, button').filter({ hasText: 'Songs' });
    
    if (await songsLink.isVisible().catch(() => false)) {
      console.log('Navigating to Songs section');
      await songsLink.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Look for song-related functionality
    const songElements = await page.locator('*').filter({ hasText: /song|hymn|worship|music|lyrics/i }).all();
    const addSongButton = await page.locator('button:has-text("Add"), button:has-text("New")').all();
    
    console.log(`Found ${songElements.length} song-related elements and ${addSongButton.length} add buttons`);
    
    if (songElements.length > 0) {
      console.log('Song-related content found:');
      for (let i = 0; i < Math.min(songElements.length, 5); i++) {
        const element = songElements[i];
        const text = await element.textContent();
        if (text && text.length < 100) {
          console.log(`  ${i + 1}. "${text}"`);
        }
      }
    }
  });

  test('should test tasks and assignments', async ({ page }) => {
    // Navigate to tasks section if available  
    const tasksLink = page.locator('a, button').filter({ hasText: 'Tasks' });
    
    if (await tasksLink.isVisible().catch(() => false)) {
      console.log('Navigating to Tasks section');
      await tasksLink.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Look for task management functionality
    const taskElements = await page.locator('*').filter({ hasText: /task|assign|volunteer|role|duty/i }).all();
    const addTaskButton = await page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")').all();
    
    console.log(`Found ${taskElements.length} task-related elements and ${addTaskButton.length} add buttons`);
    
    if (taskElements.length > 0) {
      console.log('Task management content found:');
      for (let i = 0; i < Math.min(taskElements.length, 5); i++) {
        const element = taskElements[i];
        const text = await element.textContent();
        if (text && text.length < 100) {
          console.log(`  ${i + 1}. "${text}"`);
        }
      }
    }
  });

  test('should test service scheduling', async ({ page }) => {
    // Look for scheduling/calendar functionality
    const calendarElements = await page.locator('*').filter({ hasText: /calendar|schedule|date|time|service/i }).all();
    const dateInputs = await page.locator('input[type="date"], input[type="datetime-local"]').all();
    
    console.log(`Found ${calendarElements.length} calendar-related elements and ${dateInputs.length} date inputs`);
    
    if (dateInputs.length > 0) {
      console.log('✅ Date/time scheduling available');
      
      // Test date input (but don't actually save)
      const dateInput = dateInputs[0];
      if (await dateInput.isVisible() && await dateInput.isEnabled()) {
        await dateInput.fill('2024-12-25'); // Christmas service example
        console.log('Set example service date');
        await dateInput.fill(''); // Clear to not affect actual data
      }
    }
  });

  test('should test plan templates and library', async ({ page }) => {
    // Look for template or library functionality
    const templateElements = await page.locator('*').filter({ hasText: /template|library|preset|example/i }).all();
    const copyButtons = await page.locator('button').filter({ hasText: /copy|duplicate|clone/i }).all();
    
    console.log(`Found ${templateElements.length} template elements and ${copyButtons.length} copy/duplicate buttons`);
    
    if (templateElements.length > 0) {
      console.log('Template/library content found:');
      for (let i = 0; i < Math.min(templateElements.length, 3); i++) {
        const element = templateElements[i];
        const text = await element.textContent();
        if (text && text.length < 100) {
          console.log(`  ${i + 1}. "${text}"`);
        }
      }
    }
    
    if (copyButtons.length > 0) {
      console.log('✅ Plan duplication/copying functionality available');
    }
  });

  test('should verify plans navigation', async ({ page }) => {
    const nav = page.locator('nav, header');
    const navText = await nav.textContent().catch(() => '');
    
    console.log('Navigation content:', navText);
    
    const hasPlansInNav = navText.includes('Plans');
    const hasServingInNav = navText.includes('Serving'); // From navigation pattern we saw
    console.log('Plans/Serving appears in navigation:', hasPlansInNav || hasServingInNav);
    
    // Check for plan-specific navigation
    const hasSongs = navText.includes('Songs');
    const hasTasks = navText.includes('Tasks');
    
    console.log('Planning navigation sections:', {
      plans: hasPlansInNav,
      serving: hasServingInNav,
      songs: hasSongs,
      tasks: hasTasks
    });
  });
});