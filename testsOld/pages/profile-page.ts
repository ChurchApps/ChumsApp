import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class ProfilePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly optedOutCheckbox: Locator;
  readonly saveButton: Locator;
  readonly changePasswordButton: Locator;
  readonly deleteAccountButton: Locator;
  readonly showPasswordButton: Locator;
  readonly notificationPreferences: Locator;
  readonly linkedAccounts: Locator;
  readonly pushNotificationSelect: Locator;
  readonly emailFrequencySelect: Locator;
  readonly praiseChartsLink: Locator;
  readonly praiseChartsUnlink: Locator;
  readonly mainContent: Locator;
  readonly errorMessages: Locator;
  readonly successMessages: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"], #firstName, [data-testid="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"], #lastName, [data-testid="lastName"]');
    this.emailInput = page.locator('input[name="email"], #email, [data-testid="email"]');
    this.currentPasswordInput = page.locator('input[name="currentPassword"], #currentPassword, [data-testid="currentPassword"]');
    this.newPasswordInput = page.locator('input[name="newPassword"], #newPassword, [data-testid="newPassword"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], #confirmPassword, [data-testid="confirmPassword"]');
    this.optedOutCheckbox = page.locator('input[name="optedOut"], #optedOut, [data-testid="optedOut"]');
    this.saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]');
    this.changePasswordButton = page.locator('button:has-text("Change Password"), [data-testid="change-password"]');
    this.deleteAccountButton = page.locator('button:has-text("Delete Account"), [data-testid="delete-account"]');
    this.showPasswordButton = page.locator('button[aria-label*="password"], .password-toggle');
    this.notificationPreferences = page.locator('.notification-preferences, [data-testid="notification-preferences"]');
    this.linkedAccounts = page.locator('.linked-accounts, [data-testid="linked-accounts"]');
    this.pushNotificationSelect = page.locator('select[name*="push"], select[name*="notification"]');
    this.emailFrequencySelect = page.locator('select[name*="email"], select[name*="frequency"]');
    this.praiseChartsLink = page.locator('button:has-text("Link"), a:has-text("Link")');
    this.praiseChartsUnlink = page.locator('button:has-text("Unlink"), a:has-text("Unlink")');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.errorMessages = page.locator('.error-message, .alert-danger, text=Error');
    this.successMessages = page.locator('.success-message, .alert-success, text=Success');
    this.loadingIndicator = page.locator('.loading, text=Loading');
  }

  async goto() {
    await this.page.goto('/profile');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to profile via menu
    const profileNavLink = this.page.locator('a[href="/profile"], a:has-text("Profile"), nav a:has-text("Profile")').first();
    const profileNavExists = await profileNavLink.isVisible().catch(() => false);
    
    if (profileNavExists) {
      await profileNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnProfilePage() {
    await TestHelpers.expectUrl(this.page, '/profile');
  }

  async expectProfileFormVisible() {
    const hasForm = await this.firstNameInput.isVisible().catch(() => false);
    const hasMainContent = await this.mainContent.isVisible().catch(() => false);
    return hasForm || hasMainContent;
  }

  async fillFirstName(firstName: string) {
    const firstNameExists = await this.firstNameInput.isVisible().catch(() => false);
    if (firstNameExists) {
      await this.firstNameInput.fill(firstName);
      return true;
    }
    return false;
  }

  async fillLastName(lastName: string) {
    const lastNameExists = await this.lastNameInput.isVisible().catch(() => false);
    if (lastNameExists) {
      await this.lastNameInput.fill(lastName);
      return true;
    }
    return false;
  }

  async fillEmail(email: string) {
    const emailExists = await this.emailInput.isVisible().catch(() => false);
    if (emailExists) {
      await this.emailInput.fill(email);
      return true;
    }
    return false;
  }

  async fillCurrentPassword(password: string) {
    const passwordExists = await this.currentPasswordInput.isVisible().catch(() => false);
    if (passwordExists) {
      await this.currentPasswordInput.fill(password);
      return true;
    }
    return false;
  }

  async fillNewPassword(password: string) {
    const passwordExists = await this.newPasswordInput.isVisible().catch(() => false);
    if (passwordExists) {
      await this.newPasswordInput.fill(password);
      return true;
    }
    return false;
  }

  async fillConfirmPassword(password: string) {
    const passwordExists = await this.confirmPasswordInput.isVisible().catch(() => false);
    if (passwordExists) {
      await this.confirmPasswordInput.fill(password);
      return true;
    }
    return false;
  }

  async toggleOptedOut() {
    const checkboxExists = await this.optedOutCheckbox.isVisible().catch(() => false);
    if (checkboxExists) {
      await this.optedOutCheckbox.click();
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

  async clickChangePassword() {
    const changePasswordExists = await this.changePasswordButton.isVisible().catch(() => false);
    if (changePasswordExists) {
      await this.changePasswordButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickDeleteAccount() {
    const deleteButtonExists = await this.deleteAccountButton.isVisible().catch(() => false);
    if (deleteButtonExists) {
      await this.deleteAccountButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async togglePasswordVisibility() {
    const toggleExists = await this.showPasswordButton.isVisible().catch(() => false);
    if (toggleExists) {
      await this.showPasswordButton.click();
      return true;
    }
    return false;
  }

  async expectNotificationPreferencesVisible() {
    return await this.notificationPreferences.isVisible().catch(() => false);
  }

  async expectLinkedAccountsVisible() {
    return await this.linkedAccounts.isVisible().catch(() => false);
  }

  async setPushNotificationPreference(value: string) {
    const selectExists = await this.pushNotificationSelect.isVisible().catch(() => false);
    if (selectExists) {
      await this.pushNotificationSelect.selectOption(value);
      return true;
    }
    return false;
  }

  async setEmailFrequencyPreference(value: string) {
    const selectExists = await this.emailFrequencySelect.isVisible().catch(() => false);
    if (selectExists) {
      await this.emailFrequencySelect.selectOption(value);
      return true;
    }
    return false;
  }

  async linkPraiseCharts() {
    const linkExists = await this.praiseChartsLink.isVisible().catch(() => false);
    if (linkExists) {
      await this.praiseChartsLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async unlinkPraiseCharts() {
    const unlinkExists = await this.praiseChartsUnlink.isVisible().catch(() => false);
    if (unlinkExists) {
      await this.praiseChartsUnlink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectErrorMessages() {
    return await this.errorMessages.isVisible().catch(() => false);
  }

  async expectSuccessMessages() {
    return await this.successMessages.isVisible().catch(() => false);
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async getFirstNameValue() {
    const firstNameExists = await this.firstNameInput.isVisible().catch(() => false);
    if (firstNameExists) {
      return await this.firstNameInput.inputValue();
    }
    return '';
  }

  async getLastNameValue() {
    const lastNameExists = await this.lastNameInput.isVisible().catch(() => false);
    if (lastNameExists) {
      return await this.lastNameInput.inputValue();
    }
    return '';
  }

  async getEmailValue() {
    const emailExists = await this.emailInput.isVisible().catch(() => false);
    if (emailExists) {
      return await this.emailInput.inputValue();
    }
    return '';
  }

  async getOptedOutValue() {
    const checkboxExists = await this.optedOutCheckbox.isVisible().catch(() => false);
    if (checkboxExists) {
      return await this.optedOutCheckbox.isChecked();
    }
    return false;
  }
}