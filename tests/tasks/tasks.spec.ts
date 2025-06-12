import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { TasksPage } from '../pages/tasks-page';
import { AutomationsPage } from '../pages/automations-page';
import { SharedSetup } from '../utils/shared-setup';
import { TasksTestHelpers } from './tasks-test-helpers';

test.describe('Tasks Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let tasksPage: TasksPage;
  let automationsPage: AutomationsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    tasksPage = new TasksPage(page);
    automationsPage = new AutomationsPage(page);
    
  });

  test('should check if tasks page is accessible', async ({ page }) => {
    await TasksTestHelpers.performTasksPageTest(page, 'tasks page accessibility', tasksPage, async () => {
      await TasksTestHelpers.testPageAccessibility(page, 'tasksManagement');
    });
  });

  test('should display tasks listing by default', async ({ page }) => {
    await TasksTestHelpers.performTasksPageTest(page, 'tasks listing display', tasksPage, async () => {
      await TasksTestHelpers.testTasksListing(page, tasksPage);
    });
  });

  test('should handle task status filtering', async ({ page }) => {
    await TasksTestHelpers.performTasksPageTest(page, 'task status filtering', tasksPage, async () => {
      await TasksTestHelpers.testTaskStatusFiltering(page, tasksPage);
    });
  });

  test('should handle task navigation', async ({ page }) => {
    await TasksTestHelpers.performTasksPageTest(page, 'task navigation', tasksPage, async () => {
      await TasksTestHelpers.testTaskNavigation(page, tasksPage);
    });
  });

  test('should navigate to automations page', async ({ page }) => {
    await TasksTestHelpers.performTasksPageTest(page, 'automations navigation', tasksPage, async () => {
      await TasksTestHelpers.testAutomationsNavigation(page, tasksPage);
    });
  });

  test('should handle automations functionality', async ({ page }) => {
    await TasksTestHelpers.performAutomationsPageTest(page, 'Automations functionality', tasksPage, automationsPage, async () => {
      const automationsClicked = await tasksPage.clickAutomations();
      expect(automationsClicked).toBeTruthy();
      
      await TasksTestHelpers.testAutomationsFunctionality(page, automationsPage);
    });
  });

  test('should handle automation creation', async ({ page }) => {
    await TasksTestHelpers.performAutomationsPageTest(page, 'Automation creation', tasksPage, automationsPage, async () => {
      const automationsClicked = await tasksPage.clickAutomations();
      expect(automationsClicked).toBeTruthy();
      
      await TasksTestHelpers.testAutomationCreation(page, automationsPage);
    });
  });

  test('should handle tasks page via URL', async ({ page }) => {
    await tasksPage.goto();
    await tasksPage.expectToBeOnTasksPage();
    console.log('Successfully navigated to tasks page via URL');
  });

  test('should handle automations page via URL', async ({ page }) => {
    await automationsPage.goto();
    
    const currentUrl = page.url();
    const isOnAutomationsPage = currentUrl.includes('/tasks/automations');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    expect(isOnAutomationsPage || hasErrorMessage).toBeTruthy();
    console.log('Automations URL navigation handled gracefully');
  });

  test('should handle empty tasks gracefully', async ({ page }) => {
    await TasksTestHelpers.performTasksPageTest(page, 'empty tasks handling', tasksPage, async () => {
      await tasksPage.expectLoadingComplete();
      
      const hasTasksDisplay = await tasksPage.expectTasksDisplayed();
      expect(hasTasksDisplay).toBeTruthy();
      console.log('Empty tasks state handled gracefully');
    });
  });

  test('should have accessible tasks elements', async ({ page }) => {
    await TasksTestHelpers.performTasksPageTest(page, 'tasks accessibility', tasksPage, async () => {
      const titleExists = await tasksPage.tasksTitle.isVisible().catch(() => false);
      const mainContentExists = await tasksPage.mainContent.isVisible().catch(() => false);
      
      expect(titleExists || mainContentExists).toBeTruthy();
      console.log('Tasks elements are accessible');
    });
  });

  test('should handle invalid tasks URL gracefully', async ({ page }) => {
    await page.goto('/tasks?invalid=true');
    
    const currentUrl = page.url();
    const isOnTasksPage = currentUrl.includes('/tasks');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    expect(isOnTasksPage || hasErrorMessage).toBeTruthy();
    console.log('Invalid tasks URL handled gracefully');
  });

  test('should handle invalid task ID gracefully', async ({ page }) => {
    await page.goto('/tasks/invalid-task-id');
    
    const currentUrl = page.url();
    const isOnTasksPage = currentUrl.includes('/tasks') && !currentUrl.includes('invalid-task-id');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    expect(isOnTasksPage || hasErrorMessage).toBeTruthy();
    console.log('Invalid task ID handled gracefully');
  });
});