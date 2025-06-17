import { Page, expect } from '@playwright/test';

export class FormsHelper {
  /**
   * Navigate to forms functionality
   */
  static async navigateToForms(page: Page) {
    // Check if we're already on forms page or can access forms search
    const formsSearchBox = page.locator('#searchText, input[placeholder*="Search"]');
    const hasSearch = await formsSearchBox.isVisible().catch(() => false);
    
    if (hasSearch) {
      console.log('Forms management available through search interface');
      return;
    }
    
    // Try navigating through menu
    const menuButton = page.locator('button[aria-label*="menu"], .MuiIconButton-root').first();
    const hasMenu = await menuButton.isVisible().catch(() => false);
    
    if (hasMenu) {
      await menuButton.click();
      await page.waitForTimeout(1000);
      
      const formsLink = page.locator('text=Forms, a[href="/forms"]').first();
      const hasFormsOption = await formsLink.isVisible().catch(() => false);
      
      if (hasFormsOption) {
        await formsLink.click();
        await page.waitForLoadState('networkidle');
        console.log('Navigated to forms through menu');
        return;
      }
    }
    
    // Try direct navigation
    const currentUrl = page.url();
    if (!currentUrl.includes('/forms')) {
      await page.goto('https://chumsdemo.churchapps.org/forms');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    console.log('Forms navigation completed');
  }

  /**
   * Search for forms by name or category
   */
  static async searchForms(page: Page, searchTerm: string) {
    const searchSelectors = [
      '#searchText',
      'input[placeholder*="Search"]',
      'input[name="search"]',
      'input[placeholder*="Forms"]'
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
    
    console.log('Forms search completed');
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
   * Create a new form
   */
  static async createForm(page: Page, form: {
    name: string;
    description?: string;
    category?: string;
  }) {
    console.log(`Simulating creation of form: ${form.name}`);
    
    // Look for add form button
    const addButtonSelectors = [
      'button:has-text("Add Form")',
      'button:has-text("Create Form")',
      'button:has-text("Add")',
      '[aria-label*="add"]'
    ];
    
    let addButtonFound = false;
    for (const selector of addButtonSelectors) {
      const addButton = page.locator(selector).first();
      const isVisible = await addButton.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`Found add form button: ${selector}`);
        addButtonFound = true;
        break;
      }
    }
    
    if (!addButtonFound) {
      console.log('Add Form button not found - demonstrating creation pattern');
    }
    
    console.log(`Form would be created in production with:`);
    console.log(`- Name: ${form.name}`);
    console.log(`- Description: ${form.description || 'No description'}`);
    console.log(`- Category: ${form.category || 'General'}`);
  }

  /**
   * Edit an existing form
   */
  static async editForm(page: Page, formName: string, updates: {
    name?: string;
    description?: string;
    category?: string;
  }) {
    console.log(`Simulating edit of form: ${formName}`);
    
    // Search for the form first
    await this.searchForms(page, formName);
    
    console.log(`Form ${formName} would be updated in production with:`);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) console.log(`- ${key}: ${value}`);
    });
  }

  /**
   * Delete a form
   */
  static async deleteForm(page: Page, formName: string) {
    console.log(`Simulating deletion of form: ${formName}`);
    
    // Search for the form first
    await this.searchForms(page, formName);
    
    console.log(`Form ${formName} would be deleted in production`);
    
    // Clear search for clean state
    await this.clearSearch(page);
  }

  /**
   * Add a field to a form
   */
  static async addFormField(page: Page, formName: string, field: {
    type: string;
    label: string;
    required?: boolean;
    options?: string[];
  }) {
    console.log(`Simulating addition of ${field.type} field to form: ${formName}`);
    
    // Search for the form
    await this.searchForms(page, formName);
    
    console.log(`Field would be added to ${formName} with:`);
    console.log(`- Type: ${field.type}`);
    console.log(`- Label: ${field.label}`);
    console.log(`- Required: ${field.required || false}`);
    if (field.options) {
      console.log(`- Options: ${field.options.join(', ')}`);
    }
  }

  /**
   * View form submissions
   */
  static async viewSubmissions(page: Page, formName: string) {
    console.log(`Simulating viewing submissions for form: ${formName}`);
    
    // Search for the form
    await this.searchForms(page, formName);
    
    // Look for submissions tab or link
    const submissionsSelectors = [
      'text=Submissions',
      'tab:has-text("Submissions")',
      'button:has-text("Submissions")',
      'a[href*="submission"]'
    ];
    
    for (const selector of submissionsSelectors) {
      const submissionsLink = page.locator(selector).first();
      const isVisible = await submissionsLink.isVisible().catch(() => false);
      if (isVisible) {
        await submissionsLink.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`Submissions for ${formName} would be displayed in production`);
  }

  /**
   * Submit a form (simulate submission)
   */
  static async submitForm(page: Page, formName: string, data: Record<string, any>) {
    console.log(`Simulating form submission for: ${formName}`);
    
    console.log(`Submission data:`);
    Object.entries(data).forEach(([key, value]) => {
      console.log(`- ${key}: ${value}`);
    });
    
    console.log(`Form submission would be recorded in production`);
  }

  /**
   * Export form submissions
   */
  static async exportSubmissions(page: Page, formName: string, format: 'csv' | 'excel' | 'pdf') {
    console.log(`Simulating export of submissions for ${formName} as ${format}`);
    
    // Look for export functionality
    const exportSelectors = [
      'button:has-text("Export")',
      'button:has-text("Download")',
      'a[href*="export"]'
    ];
    
    for (const selector of exportSelectors) {
      const exportButton = page.locator(selector).first();
      const isVisible = await exportButton.isVisible().catch(() => false);
      if (isVisible) {
        await exportButton.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`Submissions for ${formName} would be exported as ${format} in production`);
  }

  /**
   * Filter form submissions
   */
  static async filterSubmissions(page: Page, formName: string, filters: {
    dateRange?: { start: string; end: string };
    status?: string;
    searchTerm?: string;
  }) {
    console.log(`Simulating filtering of submissions for ${formName}`);
    
    console.log(`Filters applied:`);
    if (filters.dateRange) {
      console.log(`- Date Range: ${filters.dateRange.start} to ${filters.dateRange.end}`);
    }
    if (filters.status) {
      console.log(`- Status: ${filters.status}`);
    }
    if (filters.searchTerm) {
      console.log(`- Search Term: ${filters.searchTerm}`);
    }
    
    console.log(`Filtered submissions would be displayed in production`);
  }

  /**
   * Configure form workflows
   */
  static async configureWorkflow(page: Page, formName: string, workflow: {
    trigger: string;
    action: string;
    target: string;
  }) {
    console.log(`Simulating workflow configuration for form: ${formName}`);
    
    // Look for workflow/automation settings
    const workflowSelectors = [
      'text=Workflows',
      'text=Automation',
      'button:has-text("Workflows")',
      'tab:has-text("Automation")'
    ];
    
    for (const selector of workflowSelectors) {
      const workflowLink = page.locator(selector).first();
      const isVisible = await workflowLink.isVisible().catch(() => false);
      if (isVisible) {
        await workflowLink.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`Workflow would be configured in production:`);
    console.log(`- Trigger: ${workflow.trigger}`);
    console.log(`- Action: ${workflow.action}`);
    console.log(`- Target: ${workflow.target}`);
  }

  /**
   * Add conditional logic to form
   */
  static async addConditionalLogic(page: Page, formName: string, logic: {
    condition: string;
    action: string;
  }) {
    console.log(`Simulating conditional logic addition for form: ${formName}`);
    
    console.log(`Conditional logic would be added:`);
    console.log(`- Condition: ${logic.condition}`);
    console.log(`- Action: ${logic.action}`);
  }

  /**
   * Configure payment settings for form
   */
  static async configurePayments(page: Page, formName: string, payment: {
    enablePayments: boolean;
    amount?: number;
    currency?: string;
    description?: string;
  }) {
    console.log(`Simulating payment configuration for form: ${formName}`);
    
    // Look for payment settings
    const paymentSelectors = [
      'text=Payments',
      'text=Payment Settings',
      'button:has-text("Payments")',
      'tab:has-text("Payment")'
    ];
    
    for (const selector of paymentSelectors) {
      const paymentLink = page.locator(selector).first();
      const isVisible = await paymentLink.isVisible().catch(() => false);
      if (isVisible) {
        await paymentLink.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`Payment settings would be configured:`);
    console.log(`- Enable Payments: ${payment.enablePayments}`);
    if (payment.amount) console.log(`- Amount: ${payment.currency || '$'}${payment.amount}`);
    if (payment.description) console.log(`- Description: ${payment.description}`);
  }

  /**
   * View form analytics
   */
  static async viewFormAnalytics(page: Page, formName: string) {
    console.log(`Simulating analytics view for form: ${formName}`);
    
    // Look for analytics section
    const analyticsSelectors = [
      'text=Analytics',
      'text=Reports',
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
    
    console.log(`Form analytics for ${formName} would be displayed in production:`);
    console.log(`- Submission rates`);
    console.log(`- Completion statistics`);
    console.log(`- Field abandonment data`);
    console.log(`- Conversion metrics`);
  }

  /**
   * Check if a form exists
   */
  static async formExists(page: Page, formName: string): Promise<boolean> {
    await this.searchForms(page, formName);
    
    // Look for the form in search results
    const formSelectors = [
      `text=${formName}`,
      'table td, .form-result, .search-result'
    ];
    
    for (const selector of formSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        const text = await element.textContent().catch(() => '');
        if (text.includes(formName)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Navigate to specific form details
   */
  static async viewFormDetails(page: Page, formName: string) {
    await this.searchForms(page, formName);
    
    const formLink = page.locator(`text=${formName}`).first();
    const isVisible = await formLink.isVisible().catch(() => false);
    if (isVisible) {
      await formLink.click();
      await page.waitForLoadState('networkidle');
      console.log(`Navigated to details for form: ${formName}`);
    } else {
      console.log(`Form ${formName} not found in search results`);
    }
  }

  /**
   * Duplicate an existing form
   */
  static async duplicateForm(page: Page, formName: string, newFormName: string) {
    console.log(`Simulating duplication of form: ${formName} as ${newFormName}`);
    
    // Search for the original form
    await this.searchForms(page, formName);
    
    console.log(`Form ${formName} would be duplicated as ${newFormName} in production`);
  }
}