import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class AutomationsPage {
  readonly page: Page;
  readonly automationsTitle: Locator;
  readonly addAutomationButton: Locator;
  readonly automationsTable: Locator;
  readonly automationRows: Locator;
  readonly firstAutomationLink: Locator;
  readonly automationEdit: Locator;
  readonly automationDetails: Locator;
  readonly titleInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly loadingIndicator: Locator;
  readonly noAutomationsMessage: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.automationsTitle = page.locator('h1:has-text("Automations"), h1:has-text("automations")');
    this.addAutomationButton = page.locator('button[title*="add"], .add-button, [data-testid="add-automation"]');
    this.automationsTable = page.locator('table, [data-testid="automations-table"]');
    this.automationRows = page.locator('tbody tr, .automation-row');
    this.firstAutomationLink = page.locator('tbody tr:first-child a, .automation-row:first-child a').first();
    this.automationEdit = page.locator('.automation-edit, [data-testid="automation-edit"]');
    this.automationDetails = page.locator('.automation-details, [data-testid="automation-details"]');
    this.titleInput = page.locator('input[name="title"], #automationTitle, [data-testid="automation-title"]');
    this.saveButton = page.locator('button:has-text("Save"), [data-testid="save-automation"]');
    this.cancelButton = page.locator('button:has-text("Cancel"), [data-testid="cancel-automation"]');
    this.deleteButton = page.locator('button:has-text("Delete"), [data-testid="delete-automation"]');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.noAutomationsMessage = page.locator('text=No automations found, text=No automations available');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
  }

  async goto() {
    await this.page.goto('/tasks/automations');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectToBeOnAutomationsPage() {
    await TestHelpers.expectUrl(this.page, '/tasks/automations');
  }

  async expectAutomationsDisplayed() {
    const hasTable = await this.automationsTable.isVisible().catch(() => false);
    const hasNoAutomationsMessage = await this.noAutomationsMessage.isVisible().catch(() => false);
    const hasMainContent = await this.mainContent.isVisible().catch(() => false);
    return hasTable || hasNoAutomationsMessage || hasMainContent;
  }

  async clickAddAutomation() {
    const addButtonExists = await this.addAutomationButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addAutomationButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickFirstAutomation() {
    const firstAutomationExists = await this.firstAutomationLink.isVisible().catch(() => false);
    if (firstAutomationExists) {
      await this.firstAutomationLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async fillTitle(title: string) {
    const titleExists = await this.titleInput.isVisible().catch(() => false);
    if (titleExists) {
      await this.titleInput.fill(title);
      return true;
    }
    return false;
  }

  async clickSave() {
    const saveButtonExists = await this.saveButton.isVisible().catch(() => false);
    if (saveButtonExists) {
      await this.saveButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickCancel() {
    const cancelButtonExists = await this.cancelButton.isVisible().catch(() => false);
    if (cancelButtonExists) {
      await this.cancelButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickDelete() {
    const deleteButtonExists = await this.deleteButton.isVisible().catch(() => false);
    if (deleteButtonExists) {
      await this.deleteButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async getAutomationsCount() {
    const rows = await this.automationRows.count();
    return rows;
  }

  async expectAutomationEditVisible() {
    return await this.automationEdit.isVisible().catch(() => false);
  }

  async expectAutomationDetailsVisible() {
    return await this.automationDetails.isVisible().catch(() => false);
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }
}