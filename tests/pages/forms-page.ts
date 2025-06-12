import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class FormsPage {
  readonly page: Page;
  readonly formsTable: Locator;
  readonly addFormButton: Locator;
  readonly editFormButton: Locator;
  readonly archiveFormButton: Locator;
  readonly restoreFormButton: Locator;
  readonly formsTab: Locator;
  readonly archivedTab: Locator;
  readonly firstFormLink: Locator;
  readonly formRows: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly loadingIndicator: Locator;
  readonly noFormsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formsTable = page.locator('table, [data-testid="forms-table"]');
    this.addFormButton = page.locator('button:has-text("Add Form"), [data-testid="add-form"]');
    this.editFormButton = page.locator('button:has-text("Edit"), [data-testid="edit-form"]');
    this.archiveFormButton = page.locator('button:has-text("Archive"), [data-testid="archive-form"]');
    this.restoreFormButton = page.locator('button:has-text("Restore"), [data-testid="restore-form"]');
    this.formsTab = page.locator('button:has-text("Forms"), [role="tab"]:has-text("Forms")');
    this.archivedTab = page.locator('button:has-text("Archived"), [role="tab"]:has-text("Archived")');
    this.firstFormLink = page.locator('table tbody tr:first-child a, .form-row:first-child a').first();
    this.formRows = page.locator('tbody tr, .form-row');
    this.searchInput = page.locator('input[placeholder*="Search"], input[name*="search"]');
    this.searchButton = page.locator('button:has-text("Search"), [data-testid="search-button"]');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.noFormsMessage = page.locator('text=No custom forms found, text=No forms found');
  }

  async goto() {
    await this.page.goto('/forms');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to forms via menu
    const formsNavLink = this.page.locator('a[href="/forms"], a:has-text("Forms"), nav a:has-text("Forms")').first();
    const formsNavExists = await formsNavLink.isVisible().catch(() => false);
    
    if (formsNavExists) {
      await formsNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnFormsPage() {
    await TestHelpers.expectUrl(this.page, '/forms');
  }

  async expectFormsTableVisible() {
    const hasTable = await this.formsTable.isVisible().catch(() => false);
    const hasNoFormsMessage = await this.noFormsMessage.isVisible().catch(() => false);
    return hasTable || hasNoFormsMessage;
  }

  async expectFormsDisplayed() {
    await this.page.waitForLoadState('networkidle');
    return await this.expectFormsTableVisible();
  }

  async clickAddForm() {
    const addButtonExists = await this.addFormButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addFormButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickFirstForm() {
    const firstFormExists = await this.firstFormLink.isVisible().catch(() => false);
    if (firstFormExists) {
      await this.firstFormLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickFormsTab() {
    const formsTabExists = await this.formsTab.isVisible().catch(() => false);
    if (formsTabExists) {
      await this.formsTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickArchivedTab() {
    const archivedTabExists = await this.archivedTab.isVisible().catch(() => false);
    if (archivedTabExists) {
      await this.archivedTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async searchForms(searchTerm: string) {
    const searchInputExists = await this.searchInput.isVisible().catch(() => false);
    
    if (searchInputExists) {
      await this.searchInput.fill(searchTerm);
      
      const searchButtonExists = await this.searchButton.isVisible().catch(() => false);
      if (searchButtonExists) {
        await this.searchButton.click();
      } else {
        await this.searchInput.press('Enter');
      }
      
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async testFormsSearchFromDashboard() {
    // Test if forms search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for forms
      await dashboardSearchInput.fill('form');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any form-related results appear
      const hasFormResults = await this.page.locator('text=Form, text=form').first().isVisible().catch(() => false);
      return hasFormResults;
    }
    
    return false;
  }

  async searchFormsFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectEditFormAvailable() {
    return await this.editFormButton.isVisible().catch(() => false);
  }

  async expectArchiveFormAvailable() {
    return await this.archiveFormButton.isVisible().catch(() => false);
  }

  async expectAddFormAvailable() {
    return await this.addFormButton.isVisible().catch(() => false);
  }

  async getFormsCount() {
    const rows = await this.formRows.count();
    return rows;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async editFirstForm() {
    // Look for edit button in the first row
    const editButton = this.page.locator('tbody tr:first-child button:has-text("Edit"), .form-row:first-child button:has-text("Edit")').first();
    const editButtonExists = await editButton.isVisible().catch(() => false);
    
    if (editButtonExists) {
      await editButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async archiveFirstForm() {
    // Look for archive button in the first row
    const archiveButton = this.page.locator('tbody tr:first-child button:has-text("Archive"), .form-row:first-child button:has-text("Archive")').first();
    const archiveButtonExists = await archiveButton.isVisible().catch(() => false);
    
    if (archiveButtonExists) {
      await archiveButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async restoreFirstForm() {
    // Look for restore button in the first row
    const restoreButton = this.page.locator('tbody tr:first-child button:has-text("Restore"), .form-row:first-child button:has-text("Restore")').first();
    const restoreButtonExists = await restoreButton.isVisible().catch(() => false);
    
    if (restoreButtonExists) {
      await restoreButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }
}