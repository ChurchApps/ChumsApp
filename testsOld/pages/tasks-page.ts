import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class TasksPage {
  readonly page: Page;
  readonly tasksTitle: Locator;
  readonly automationsButton: Locator;
  readonly showClosedButton: Locator;
  readonly showOpenButton: Locator;
  readonly tasksList: Locator;
  readonly taskRows: Locator;
  readonly firstTaskLink: Locator;
  readonly loadingIndicator: Locator;
  readonly noTasksMessage: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tasksTitle = page.locator('h1:has-text("Tasks"), h1:has-text("tasks")');
    this.automationsButton = page.locator('a[href="/tasks/automations"], button:has-text("Automations")');
    this.showClosedButton = page.locator('button:has-text("Show Closed"), button:has-text("showClosed")');
    this.showOpenButton = page.locator('button:has-text("Show Open"), button:has-text("showOpen")');
    this.tasksList = page.locator('.task-list, [data-testid="tasks-list"]');
    this.taskRows = page.locator('tbody tr, .task-row');
    this.firstTaskLink = page.locator('tbody tr:first-child a, .task-row:first-child a').first();
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.noTasksMessage = page.locator('text=No tasks found, text=No tasks available');
    this.mainContent = page.locator('#mainContent, main, .main-content');
  }

  async goto() {
    await this.page.goto('/tasks');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to tasks via menu
    const tasksNavLink = this.page.locator('a[href="/tasks"], a:has-text("Tasks"), nav a:has-text("Tasks")').first();
    const tasksNavExists = await tasksNavLink.isVisible().catch(() => false);
    
    if (tasksNavExists) {
      await tasksNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnTasksPage() {
    await TestHelpers.expectUrl(this.page, '/tasks');
  }

  async expectTasksDisplayed() {
    const hasList = await this.tasksList.isVisible().catch(() => false);
    const hasNoTasksMessage = await this.noTasksMessage.isVisible().catch(() => false);
    const hasMainContent = await this.mainContent.isVisible().catch(() => false);
    return hasList || hasNoTasksMessage || hasMainContent;
  }

  async clickAutomations() {
    const automationsExists = await this.automationsButton.isVisible().catch(() => false);
    if (automationsExists) {
      await this.automationsButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickShowClosed() {
    const showClosedExists = await this.showClosedButton.isVisible().catch(() => false);
    if (showClosedExists) {
      await this.showClosedButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickShowOpen() {
    const showOpenExists = await this.showOpenButton.isVisible().catch(() => false);
    if (showOpenExists) {
      await this.showOpenButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickFirstTask() {
    const firstTaskExists = await this.firstTaskLink.isVisible().catch(() => false);
    if (firstTaskExists) {
      await this.firstTaskLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async getTasksCount() {
    const rows = await this.taskRows.count();
    return rows;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async testTasksSearchFromDashboard() {
    // Test if tasks search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for task-related terms
      await dashboardSearchInput.fill('task');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any task-related results appear
      const hasTaskResults = await this.page.locator('text=Task, text=task, text=Todo, text=todo').first().isVisible().catch(() => false);
      return hasTaskResults;
    }
    
    return false;
  }

  async searchTasksFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}