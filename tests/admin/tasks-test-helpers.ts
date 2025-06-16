import { Page, expect } from '@playwright/test';
import { TasksPage } from '../pages/tasks-page';
import { AutomationsPage } from '../pages/automations-page';
import { SharedSetup } from '../utils/shared-setup';

export class TasksTestHelpers {
  
  /**
   * Main helper for testing tasks page functionality - expects it to work
   */
  static async performTasksPageTest(
    page: Page, 
    testName: string, 
    tasksPage: TasksPage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/tasks');
    await tasksPage.expectToBeOnTasksPage();
    await testFunction();
    console.log(`${testName} verified on tasks page`);
  }

  /**
   * Helper for automations page navigation tests
   */
  static async performAutomationsPageTest(
    page: Page, 
    testName: string, 
    tasksPage: TasksPage, 
    automationsPage: AutomationsPage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/tasks');
    await tasksPage.expectToBeOnTasksPage();
    await testFunction();
    console.log(`${testName} verified`);
  }

  /**
   * Helper to test tasks listing functionality
   */
  static async testTasksListing(page: Page, tasksPage: TasksPage) {
    console.log('Testing tasks listing functionality');
    
    await tasksPage.expectLoadingComplete();
    
    const hasTasksDisplay = await tasksPage.expectTasksDisplayed();
    expect(hasTasksDisplay).toBeTruthy();
    
    const tasksCount = await tasksPage.getTasksCount();
    console.log(`Found ${tasksCount} tasks`);
    
    return true;
  }

  /**
   * Helper to test task status filtering
   */
  static async testTaskStatusFiltering(page: Page, tasksPage: TasksPage) {
    console.log('Testing task status filtering');
    
    const showClosedClicked = await tasksPage.clickShowClosed();
    expect(showClosedClicked).toBeTruthy();
    console.log('Show closed tasks functionality available');
    
    const showOpenClicked = await tasksPage.clickShowOpen();
    expect(showOpenClicked).toBeTruthy();
    console.log('Show open tasks functionality available');
    
    return true;
  }

  /**
   * Helper to test task navigation
   */
  static async testTaskNavigation(page: Page, tasksPage: TasksPage) {
    console.log('Testing task navigation');
    
    const tasksCount = await tasksPage.getTasksCount();
    expect(tasksCount).toBeGreaterThan(0);
    
    const taskClicked = await tasksPage.clickFirstTask();
    expect(taskClicked).toBeTruthy();
    
    console.log('Task navigation functionality available');
    return true;
  }

  /**
   * Helper to test automations navigation
   */
  static async testAutomationsNavigation(page: Page, tasksPage: TasksPage) {
    console.log('Testing automations navigation');
    
    const automationsClicked = await tasksPage.clickAutomations();
    expect(automationsClicked).toBeTruthy();
    
    const currentUrl = page.url();
    const isOnAutomationsPage = currentUrl.includes('/tasks/automations');
    expect(isOnAutomationsPage).toBeTruthy();
    
    console.log('Successfully navigated to automations page');
    return true;
  }

  /**
   * Helper to test automations functionality
   */
  static async testAutomationsFunctionality(page: Page, automationsPage: AutomationsPage) {
    console.log('Testing automations functionality');
    
    await automationsPage.expectLoadingComplete();
    
    const hasAutomationsDisplay = await automationsPage.expectAutomationsDisplayed();
    expect(hasAutomationsDisplay).toBeTruthy();
    
    const automationsCount = await automationsPage.getAutomationsCount();
    console.log(`Found ${automationsCount} automations`);
    
    return true;
  }

  /**
   * Helper to test automation creation
   */
  static async testAutomationCreation(page: Page, automationsPage: AutomationsPage) {
    console.log('Testing automation creation');
    
    const testData = this.getTestData().automation;
    
    const addClicked = await automationsPage.clickAddAutomation();
    expect(addClicked).toBeTruthy();
    
    const titleFilled = await automationsPage.fillTitle(testData.title);
    expect(titleFilled).toBeTruthy();
    console.log('Automation creation form accessible');
    
    return true;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    const components = {
      tasksManagement: {
        title: 'h1:has-text("Tasks"), h1:has-text("tasks")',
        content: '#mainContent, .task-list'
      },
      automationsManagement: {
        title: 'h1:has-text("Automations"), h1:has-text("automations")',
        content: 'table, .automations'
      },
      navigation: {
        title: 'h1',
        content: '#mainContent'
      }
    };

    const config = components[componentType] || components.navigation;
    
    const hasTitle = await page.locator(config.title).first().isVisible().catch(() => false);
    const hasContent = await page.locator(config.content).first().isVisible().catch(() => false);
    
    expect(hasTitle || hasContent).toBeTruthy();
    console.log(`${componentType} page accessible and main components visible`);
    return true;
  }

  /**
   * Common test data for tasks testing
   */
  static getTestData() {
    return {
      task: {
        title: 'Test Task',
        description: 'Test task description',
        status: 'Open'
      },
      automation: {
        title: 'Test Automation',
        active: true,
        recurs: 'never'
      }
    };
  }
}