import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class RolePage {
  readonly page: Page;
  readonly roleMembersSection: Locator;
  readonly userManagementSection: Locator;
  readonly permissionsSection: Locator;
  readonly addUserButton: Locator;
  readonly searchPersonInput: Locator;
  readonly searchPersonButton: Locator;
  readonly createUserButton: Locator;
  readonly userEmailInput: Locator;
  readonly userFirstNameInput: Locator;
  readonly userLastNameInput: Locator;
  readonly saveUserButton: Locator;
  readonly cancelUserButton: Locator;
  readonly membersTable: Locator;
  readonly memberRows: Locator;
  readonly permissionCheckboxes: Locator;
  readonly permissionSections: Locator;
  readonly roleNameHeader: Locator;
  readonly editRoleButton: Locator;
  readonly deleteRoleButton: Locator;
  readonly backToSettingsLink: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessages: Locator;
  readonly successMessages: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roleMembersSection = page.locator('.role-members, [data-testid="role-members"]');
    this.userManagementSection = page.locator('.user-management, [data-testid="user-management"]');
    this.permissionsSection = page.locator('.permissions, [data-testid="permissions"]');
    this.addUserButton = page.locator('button:has-text("Add User"), [data-testid="add-user"]');
    this.searchPersonInput = page.locator('input[placeholder*="search"], input[name*="search"]');
    this.searchPersonButton = page.locator('button:has-text("Search"), [data-testid="search-person"]');
    this.createUserButton = page.locator('button:has-text("Create User"), [data-testid="create-user"]');
    this.userEmailInput = page.locator('input[name="email"], #userEmail, [data-testid="user-email"]');
    this.userFirstNameInput = page.locator('input[name="firstName"], #userFirstName, [data-testid="user-first-name"]');
    this.userLastNameInput = page.locator('input[name="lastName"], #userLastName, [data-testid="user-last-name"]');
    this.saveUserButton = page.locator('button:has-text("Save User"), [data-testid="save-user"]');
    this.cancelUserButton = page.locator('button:has-text("Cancel"), [data-testid="cancel-user"]');
    this.membersTable = page.locator('table, [data-testid="members-table"]');
    this.memberRows = page.locator('tbody tr, .member-row');
    this.permissionCheckboxes = page.locator('input[type="checkbox"]');
    this.permissionSections = page.locator('.permission-section, .accordion');
    this.roleNameHeader = page.locator('h1, h2, .role-name');
    this.editRoleButton = page.locator('button:has-text("Edit Role"), [data-testid="edit-role"]');
    this.deleteRoleButton = page.locator('button:has-text("Delete Role"), [data-testid="delete-role"]');
    this.backToSettingsLink = page.locator('a:has-text("Settings"), [data-testid="back-to-settings"]');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.errorMessages = page.locator('.error-message, .alert-danger, text=Error');
    this.successMessages = page.locator('.success-message, .alert-success, text=Success');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
  }

  async goto(roleId: string) {
    await this.page.goto(`/settings/role/${roleId}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectToBeOnRolePage() {
    await TestHelpers.expectUrl(this.page, '/settings/role/\\w+');
  }

  async expectRoleDetailsVisible() {
    const hasMainContent = await this.mainContent.isVisible().catch(() => false);
    const hasRoleContent = await this.page.locator('h1, h2, text=Role, text=role').first().isVisible().catch(() => false);
    return hasMainContent || hasRoleContent;
  }

  async expectRoleMembersVisible() {
    const hasMembers = await this.roleMembersSection.isVisible().catch(() => false);
    const hasMembersTable = await this.membersTable.isVisible().catch(() => false);
    return hasMembers || hasMembersTable;
  }

  async expectUserManagementVisible() {
    const hasUserManagement = await this.userManagementSection.isVisible().catch(() => false);
    const hasAddUser = await this.addUserButton.isVisible().catch(() => false);
    return hasUserManagement || hasAddUser;
  }

  async expectPermissionsVisible() {
    const hasPermissions = await this.permissionsSection.isVisible().catch(() => false);
    const hasPermissionCheckboxes = await this.permissionCheckboxes.first().isVisible().catch(() => false);
    return hasPermissions || hasPermissionCheckboxes;
  }

  async clickAddUser() {
    const addUserExists = await this.addUserButton.isVisible().catch(() => false);
    if (addUserExists) {
      await this.addUserButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async searchPerson(searchTerm: string) {
    const searchInputExists = await this.searchPersonInput.isVisible().catch(() => false);
    if (searchInputExists) {
      await this.searchPersonInput.fill(searchTerm);
      
      const searchButtonExists = await this.searchPersonButton.isVisible().catch(() => false);
      if (searchButtonExists) {
        await this.searchPersonButton.click();
      } else {
        await this.searchPersonInput.press('Enter');
      }
      
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async fillUserEmail(email: string) {
    const emailExists = await this.userEmailInput.isVisible().catch(() => false);
    if (emailExists) {
      await this.userEmailInput.fill(email);
      return true;
    }
    return false;
  }

  async fillUserFirstName(firstName: string) {
    const firstNameExists = await this.userFirstNameInput.isVisible().catch(() => false);
    if (firstNameExists) {
      await this.userFirstNameInput.fill(firstName);
      return true;
    }
    return false;
  }

  async fillUserLastName(lastName: string) {
    const lastNameExists = await this.userLastNameInput.isVisible().catch(() => false);
    if (lastNameExists) {
      await this.userLastNameInput.fill(lastName);
      return true;
    }
    return false;
  }

  async clickCreateUser() {
    const createUserExists = await this.createUserButton.isVisible().catch(() => false);
    if (createUserExists) {
      await this.createUserButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickSaveUser() {
    const saveUserExists = await this.saveUserButton.isVisible().catch(() => false);
    if (saveUserExists) {
      await this.saveUserButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickCancelUser() {
    const cancelUserExists = await this.cancelUserButton.isVisible().catch(() => false);
    if (cancelUserExists) {
      await this.cancelUserButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async getMembersCount() {
    const rows = await this.memberRows.count();
    return rows;
  }

  async getPermissionCheckboxCount() {
    const checkboxes = await this.permissionCheckboxes.count();
    return checkboxes;
  }

  async togglePermission(index: number) {
    const checkboxExists = await this.permissionCheckboxes.nth(index).isVisible().catch(() => false);
    if (checkboxExists) {
      await this.permissionCheckboxes.nth(index).click();
      return true;
    }
    return false;
  }

  async expandPermissionSection(index: number) {
    const sectionExists = await this.permissionSections.nth(index).isVisible().catch(() => false);
    if (sectionExists) {
      await this.permissionSections.nth(index).click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickEditRole() {
    const editRoleExists = await this.editRoleButton.isVisible().catch(() => false);
    if (editRoleExists) {
      await this.editRoleButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickDeleteRole() {
    const deleteRoleExists = await this.deleteRoleButton.isVisible().catch(() => false);
    if (deleteRoleExists) {
      await this.deleteRoleButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickBackToSettings() {
    const backLinkExists = await this.backToSettingsLink.isVisible().catch(() => false);
    if (backLinkExists) {
      await this.backToSettingsLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async expectErrorMessages() {
    return await this.errorMessages.isVisible().catch(() => false);
  }

  async expectSuccessMessages() {
    return await this.successMessages.isVisible().catch(() => false);
  }

  async getRoleNameText() {
    const nameExists = await this.roleNameHeader.isVisible().catch(() => false);
    if (nameExists) {
      return await this.roleNameHeader.textContent();
    }
    return '';
  }

  async removeMember(index: number) {
    const removeButton = this.page.locator('tbody tr button:has-text("Remove"), .member-row button:has-text("Remove")').nth(index);
    const removeButtonExists = await removeButton.isVisible().catch(() => false);
    if (removeButtonExists) {
      await removeButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async editMember(index: number) {
    const editButton = this.page.locator('tbody tr button:has-text("Edit"), .member-row button:has-text("Edit")').nth(index);
    const editButtonExists = await editButton.isVisible().catch(() => false);
    if (editButtonExists) {
      await editButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }
}