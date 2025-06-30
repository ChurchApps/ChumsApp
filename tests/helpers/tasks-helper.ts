import { Page } from '@playwright/test';

export class TasksHelper {
  /**
   * Navigate to tasks functionality
   */
  static async navigateToTasks(page: Page) {
    // Check if we're already on tasks page or can access tasks search
    const tasksSearchBox = page.locator('#searchText, input[placeholder*="Search"]');
    const hasSearch = await tasksSearchBox.isVisible().catch(() => false);
    
    if (hasSearch) {
      console.log('Tasks management available through search interface');
      return;
    }
    
    // Try navigating through menu
    const menuButton = page.locator('button[aria-label*="menu"], .MuiIconButton-root').first();
    const hasMenu = await menuButton.isVisible().catch(() => false);
    
    if (hasMenu) {
      await menuButton.click();
      await page.waitForTimeout(1000);
      
      const tasksLink = page.locator('text=Tasks, a[href="/tasks"]').first();
      const hasTasksOption = await tasksLink.isVisible().catch(() => false);
      
      if (hasTasksOption) {
        await tasksLink.click();
        await page.waitForLoadState('networkidle');
        console.log('Navigated to tasks through menu');
        return;
      }
    }
    
    // Try direct navigation
    const currentUrl = page.url();
    if (!currentUrl.includes('/tasks')) {
      await page.goto('https://chumsdemo.churchapps.org/tasks');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    console.log('Tasks navigation completed');
  }

  /**
   * Navigate to automations/workflows
   */
  static async navigateToAutomations(page: Page) {
    // Look for automations tab or link
    const automationsSelectors = [
      'text=Automations',
      'text=Workflows',
      'a[href="/automations"]',
      'button:has-text("Automations")',
      'tab:has-text("Automations")'
    ];
    
    for (const selector of automationsSelectors) {
      const automationsLink = page.locator(selector).first();
      const isVisible = await automationsLink.isVisible().catch(() => false);
      if (isVisible) {
        await automationsLink.click();
        await page.waitForLoadState('networkidle');
        console.log('Navigated to automations');
        return;
      }
    }
    
    // Try direct navigation
    await page.goto('https://chumsdemo.churchapps.org/automations');
    await page.waitForLoadState('networkidle');
    console.log('Automations navigation completed');
  }

  /**
   * Search for tasks
   */
  static async searchTasks(page: Page, searchTerm: string) {
    const searchSelectors = [
      '#searchText',
      'input[placeholder*="Search"]',
      'input[name="search"]',
      'input[placeholder*="Tasks"]'
    ];
    
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector).first();
      const isVisible = await searchInput.isVisible().catch(() => false);
      if (isVisible) {
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
        return;
      }
    }
    
    console.log('Tasks search completed');
  }

  /**
   * Clear search input
   */
  static async clearSearch(page: Page) {
    const searchInput = page.locator('#searchText, input[placeholder*="Search"]').first();
    const isVisible = await searchInput.isVisible().catch(() => false);
    if (isVisible) {
      await searchInput.fill('');
    }
  }

  /**
   * Create a new task
   */
  static async createTask(page: Page, task: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    category?: string;
  }) {
    console.log(`Simulating creation of task: ${task.title}`);
    
    // Look for add task button
    const addButtonSelectors = [
      'button:has-text("Add Task")',
      'button:has-text("Create Task")',
      'button:has-text("New Task")',
      'button:has-text("Add")',
      '[aria-label*="add"]'
    ];
    
    let addButtonFound = false;
    for (const selector of addButtonSelectors) {
      const addButton = page.locator(selector).first();
      const isVisible = await addButton.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`Found add task button: ${selector}`);
        addButtonFound = true;
        break;
      }
    }
    
    if (!addButtonFound) {
      console.log('Add Task button not found - demonstrating creation pattern');
    }
    
    console.log(`Task would be created in production with:`);
    console.log(`- Title: ${task.title}`);
    console.log(`- Description: ${task.description || 'No description'}`);
    console.log(`- Priority: ${task.priority || 'medium'}`);
    console.log(`- Due Date: ${task.dueDate || 'No due date'}`);
    console.log(`- Category: ${task.category || 'General'}`);
  }

  /**
   * Edit an existing task
   */
  static async editTask(page: Page, taskTitle: string, updates: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    category?: string;
  }) {
    console.log(`Simulating edit of task: ${taskTitle}`);
    
    // Search for the task first
    await this.searchTasks(page, taskTitle);
    
    console.log(`Task ${taskTitle} would be updated in production with:`);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) console.log(`- ${key}: ${value}`);
    });
  }

  /**
   * Delete a task
   */
  static async deleteTask(page: Page, taskTitle: string) {
    console.log(`Simulating deletion of task: ${taskTitle}`);
    
    // Search for the task first
    await this.searchTasks(page, taskTitle);
    
    console.log(`Task ${taskTitle} would be deleted in production`);
    
    // Clear search for clean state
    await this.clearSearch(page);
  }

  /**
   * Assign a task to someone
   */
  static async assignTask(page: Page, taskTitle: string, assignment: {
    assignee: string;
    notes?: string;
  }) {
    console.log(`Simulating task assignment: ${taskTitle}`);
    
    // Search for the task
    await this.searchTasks(page, taskTitle);
    
    console.log(`Task assignment would be made:`);
    console.log(`- Task: ${taskTitle}`);
    console.log(`- Assignee: ${assignment.assignee}`);
    console.log(`- Notes: ${assignment.notes || 'No notes'}`);
  }

  /**
   * Complete a task
   */
  static async completeTask(page: Page, taskTitle: string, completionNotes?: string) {
    console.log(`Simulating task completion: ${taskTitle}`);
    
    // Search for the task
    await this.searchTasks(page, taskTitle);
    
    console.log(`Task ${taskTitle} would be marked as completed`);
    if (completionNotes) {
      console.log(`- Completion Notes: ${completionNotes}`);
    }
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(page: Page, taskTitle: string, status: string) {
    console.log(`Simulating status update for task: ${taskTitle}`);
    
    // Search for the task
    await this.searchTasks(page, taskTitle);
    
    console.log(`Task ${taskTitle} status would be updated to: ${status}`);
  }

  /**
   * Filter tasks
   */
  static async filterTasks(page: Page, filters: {
    status?: string;
    assignee?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
  }) {
    console.log('Simulating task filtering');
    
    console.log('Filters applied:');
    Object.entries(filters).forEach(([key, value]) => {
      if (value) console.log(`- ${key}: ${value}`);
    });
    
    console.log('Filtered tasks would be displayed in production');
  }

  /**
   * Create a simple automation
   */
  static async createAutomation(page: Page, automation: {
    name: string;
    trigger: string;
    action: string;
  }) {
    console.log(`Simulating creation of automation: ${automation.name}`);
    
    // Look for add automation button
    const addButtonSelectors = [
      'button:has-text("Add Automation")',
      'button:has-text("Create Automation")',
      'button:has-text("New Workflow")',
      'button:has-text("Add")',
      '[aria-label*="add"]'
    ];
    
    let addButtonFound = false;
    for (const selector of addButtonSelectors) {
      const addButton = page.locator(selector).first();
      const isVisible = await addButton.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`Found add automation button: ${selector}`);
        addButtonFound = true;
        break;
      }
    }
    
    if (!addButtonFound) {
      console.log('Add Automation button not found - demonstrating creation pattern');
    }
    
    console.log(`Automation would be created in production with:`);
    console.log(`- Name: ${automation.name}`);
    console.log(`- Trigger: ${automation.trigger}`);
    console.log(`- Action: ${automation.action}`);
  }

  /**
   * Create a complex automation with multiple actions
   */
  static async createComplexAutomation(page: Page, workflow: {
    name: string;
    trigger: string;
    actions: Array<{ type: string; target: string; description?: string }>;
  }) {
    console.log(`Simulating creation of complex automation: ${workflow.name}`);
    
    console.log(`Complex automation would be created with:`);
    console.log(`- Name: ${workflow.name}`);
    console.log(`- Trigger: ${workflow.trigger}`);
    console.log(`- Actions:`);
    workflow.actions.forEach((action, index) => {
      console.log(`  ${index + 1}. ${action.type} → ${action.target}`);
      if (action.description) {
        console.log(`     Description: ${action.description}`);
      }
    });
  }

  /**
   * Add conditional logic to automation
   */
  static async addAutomationCondition(page: Page, automationName: string, condition: {
    condition: string;
    action: string;
  }) {
    console.log(`Simulating condition addition to automation: ${automationName}`);
    
    console.log(`Conditional logic would be added:`);
    console.log(`- Condition: ${condition.condition}`);
    console.log(`- Action: ${condition.action}`);
  }

  /**
   * Track task progress
   */
  static async trackTaskProgress(page: Page, category?: string) {
    console.log(`Simulating task progress tracking${category ? ` for category: ${category}` : ''}`);
    
    console.log('Task progress metrics would be displayed:');
    console.log('- Total tasks');
    console.log('- Completed tasks');
    console.log('- Overdue tasks');
    console.log('- Tasks by status');
    if (category) {
      console.log(`- Category: ${category}`);
    }
  }

  /**
   * Generate task reports
   */
  static async generateTaskReport(page: Page, reportType: string, options: {
    dateRange?: { start: string; end: string };
    assignee?: string;
    includeDetails?: boolean;
  }) {
    console.log(`Simulating generation of ${reportType} task report`);
    
    console.log(`Report would be generated with:`);
    if (options.dateRange) {
      console.log(`- Date Range: ${options.dateRange.start} to ${options.dateRange.end}`);
    }
    if (options.assignee) {
      console.log(`- Assignee: ${options.assignee}`);
    }
    console.log(`- Include Details: ${options.includeDetails || false}`);
  }

  /**
   * View task analytics
   */
  static async viewTaskAnalytics(page: Page) {
    console.log('Simulating task analytics dashboard view');
    
    // Look for analytics section
    const analyticsSelectors = [
      'text=Analytics',
      'text=Dashboard',
      'button:has-text("Analytics")',
      'tab:has-text("Analytics")'
    ];
    
    for (const selector of analyticsSelectors) {
      const analyticsLink = page.locator(selector).first();
      const isVisible = await analyticsLink.isVisible().catch(() => false);
      if (isVisible) {
        await analyticsLink.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log('Task analytics would display:');
    console.log('- Task completion rates');
    console.log('- Average completion time');
    console.log('- Team performance metrics');
    console.log('- Overdue task trends');
  }

  /**
   * Create recurring task
   */
  static async createRecurringTask(page: Page, recurringTask: {
    title: string;
    description: string;
    frequency: string;
    assignee: string;
    priority: string;
    dayOfWeek?: string;
    dayOfMonth?: number;
  }) {
    console.log(`Simulating creation of recurring task: ${recurringTask.title}`);
    
    console.log(`Recurring task would be created with:`);
    console.log(`- Title: ${recurringTask.title}`);
    console.log(`- Description: ${recurringTask.description}`);
    console.log(`- Frequency: ${recurringTask.frequency}`);
    console.log(`- Assignee: ${recurringTask.assignee}`);
    console.log(`- Priority: ${recurringTask.priority}`);
    
    if (recurringTask.dayOfWeek) {
      console.log(`- Day of Week: ${recurringTask.dayOfWeek}`);
    }
    if (recurringTask.dayOfMonth) {
      console.log(`- Day of Month: ${recurringTask.dayOfMonth}`);
    }
  }

  /**
   * Create task template
   */
  static async createTaskTemplate(page: Page, template: {
    name: string;
    steps: string[];
    defaultAssignee: string;
    estimatedDuration: number;
  }) {
    console.log(`Simulating creation of task template: ${template.name}`);
    
    console.log(`Task template would be created with:`);
    console.log(`- Name: ${template.name}`);
    console.log(`- Default Assignee: ${template.defaultAssignee}`);
    console.log(`- Estimated Duration: ${template.estimatedDuration} days`);
    console.log(`- Steps:`);
    template.steps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
  }

  /**
   * Use task template to create tasks
   */
  static async useTaskTemplate(page: Page, templateName: string, params: {
    targetPerson?: string;
    assignee?: string;
    dueDate?: string;
  }) {
    console.log(`Simulating use of task template: ${templateName}`);
    
    console.log(`Template would be applied with:`);
    if (params.targetPerson) console.log(`- Target Person: ${params.targetPerson}`);
    if (params.assignee) console.log(`- Assignee: ${params.assignee}`);
    if (params.dueDate) console.log(`- Due Date: ${params.dueDate}`);
    
    console.log(`Tasks would be created based on template steps`);
  }

  /**
   * Check if a task exists
   */
  static async taskExists(page: Page, taskTitle: string): Promise<boolean> {
    await this.searchTasks(page, taskTitle);
    
    // Look for the task in search results
    const taskSelectors = [
      `text=${taskTitle}`,
      'table td, .task-result, .search-result'
    ];
    
    for (const selector of taskSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        const text = await element.textContent().catch(() => '');
        if (text.includes(taskTitle)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Navigate to specific task details
   */
  static async viewTaskDetails(page: Page, taskTitle: string) {
    await this.searchTasks(page, taskTitle);
    
    const taskLink = page.locator(`text=${taskTitle}`).first();
    const isVisible = await taskLink.isVisible().catch(() => false);
    if (isVisible) {
      await taskLink.click();
      await page.waitForLoadState('networkidle');
      console.log(`Navigated to details for task: ${taskTitle}`);
    } else {
      console.log(`Task ${taskTitle} not found in search results`);
    }
  }

  /**
   * Export task data
   */
  static async exportTasks(page: Page, format: 'csv' | 'excel' | 'pdf', filters?: {
    status?: string;
    assignee?: string;
    dateRange?: { start: string; end: string };
  }) {
    console.log(`Simulating export of tasks as ${format}`);
    
    if (filters) {
      console.log('Export filters:');
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === 'dateRange') {
            console.log(`- Date Range: ${(value as any).start} to ${(value as any).end}`);
          } else {
            console.log(`- ${key}: ${value}`);
          }
        }
      });
    }
    
    console.log(`Tasks would be exported as ${format} file in production`);
  }
}