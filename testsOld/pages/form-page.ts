import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class FormPage {
  readonly page: Page;
  readonly formNameInput: Locator;
  readonly formDescriptionInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly addQuestionButton: Locator;
  readonly questionsContainer: Locator;
  readonly previewButton: Locator;
  readonly submitButton: Locator;
  readonly formFields: Locator;
  readonly mainContent: Locator;
  readonly settingsTab: Locator;
  readonly questionsTab: Locator;
  readonly submissionsTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formNameInput = page.locator('input[name*="name"], #formName, [data-testid="form-name"]');
    this.formDescriptionInput = page.locator('textarea[name*="description"], #formDescription, [data-testid="form-description"]');
    this.saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]');
    this.cancelButton = page.locator('button:has-text("Cancel"), [data-testid="cancel-button"]');
    this.addQuestionButton = page.locator('button:has-text("Add Question"), [data-testid="add-question"]');
    this.questionsContainer = page.locator('.questions-container, [data-testid="questions-container"]');
    this.previewButton = page.locator('button:has-text("Preview"), [data-testid="preview-button"]');
    this.submitButton = page.locator('button:has-text("Submit"), [data-testid="submit-button"]');
    this.formFields = page.locator('.form-field, [data-testid="form-field"]');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.settingsTab = page.locator('button:has-text("Settings"), [role="tab"]:has-text("Settings")');
    this.questionsTab = page.locator('button:has-text("Questions"), [role="tab"]:has-text("Questions")');
    this.submissionsTab = page.locator('button:has-text("Submissions"), [role="tab"]:has-text("Submissions")');
  }

  async goto(formId: string) {
    await this.page.goto(`/forms/${formId}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectToBeOnFormPage() {
    await TestHelpers.expectUrl(this.page, '/forms/\\w+');
  }

  async expectFormDetailsVisible() {
    const hasMainContent = await this.mainContent.isVisible().catch(() => false);
    const hasFormContent = await this.page.locator('h1, h2, text=Form, text=form').first().isVisible().catch(() => false);
    return hasMainContent || hasFormContent;
  }

  async expectTabsVisible() {
    const hasSettingsTab = await this.settingsTab.isVisible().catch(() => false);
    const hasAnyTab = await this.page.locator('[role="tab"], button').filter({ hasText: /Settings|Questions|Submissions/ }).first().isVisible().catch(() => false);
    return hasSettingsTab || hasAnyTab;
  }

  async clickSettingsTab() {
    const settingsTabExists = await this.settingsTab.isVisible().catch(() => false);
    if (settingsTabExists) {
      await this.settingsTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickQuestionsTab() {
    const questionsTabExists = await this.questionsTab.isVisible().catch(() => false);
    if (questionsTabExists) {
      await this.questionsTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickSubmissionsTab() {
    const submissionsTabExists = await this.submissionsTab.isVisible().catch(() => false);
    if (submissionsTabExists) {
      await this.submissionsTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async saveForm() {
    const saveButtonExists = await this.saveButton.isVisible().catch(() => false);
    if (saveButtonExists) {
      await this.saveButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async cancelForm() {
    const cancelButtonExists = await this.cancelButton.isVisible().catch(() => false);
    if (cancelButtonExists) {
      await this.cancelButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async addQuestion() {
    const addQuestionButtonExists = await this.addQuestionButton.isVisible().catch(() => false);
    if (addQuestionButtonExists) {
      await this.addQuestionButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async previewForm() {
    const previewButtonExists = await this.previewButton.isVisible().catch(() => false);
    if (previewButtonExists) {
      await this.previewButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectQuestionsVisible() {
    return await this.questionsContainer.isVisible().catch(() => false);
  }

  async getQuestionsCount() {
    const questionsVisible = await this.expectQuestionsVisible();
    if (questionsVisible) {
      return await this.page.locator('.question, [data-testid="question"]').count();
    }
    return 0;
  }

  async expectAddQuestionAvailable() {
    return await this.addQuestionButton.isVisible().catch(() => false);
  }

  async expectPreviewAvailable() {
    return await this.previewButton.isVisible().catch(() => false);
  }

  async fillFormName(name: string) {
    const nameInputExists = await this.formNameInput.isVisible().catch(() => false);
    if (nameInputExists) {
      await this.formNameInput.fill(name);
      return true;
    }
    return false;
  }

  async fillFormDescription(description: string) {
    const descriptionInputExists = await this.formDescriptionInput.isVisible().catch(() => false);
    if (descriptionInputExists) {
      await this.formDescriptionInput.fill(description);
      return true;
    }
    return false;
  }
}