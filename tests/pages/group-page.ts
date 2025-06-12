import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class GroupPage {
  readonly page: Page;
  readonly settingsTab: Locator;
  readonly membersTab: Locator;
  readonly sessionsTab: Locator;
  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly groupNameInput: Locator;
  readonly groupDescriptionInput: Locator;
  readonly addMemberButton: Locator;
  readonly addSessionButton: Locator;
  readonly membersTable: Locator;
  readonly sessionsTable: Locator;
  readonly mainContent: Locator;
  readonly sideNavigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsTab = page.locator('li:has-text("Settings"), a:has-text("Settings"), button:has-text("Settings")');
    this.membersTab = page.locator('li:has-text("Members"), a:has-text("Members"), button:has-text("Members")');
    this.sessionsTab = page.locator('li:has-text("Sessions"), a:has-text("Sessions"), button:has-text("Sessions")');
    this.editButton = page.locator('button:has-text("Edit"), [data-testid="edit-button"]');
    this.saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]');
    this.cancelButton = page.locator('button:has-text("Cancel"), [data-testid="cancel-button"]');
    this.deleteButton = page.locator('button:has-text("Delete"), [data-testid="delete-button"]');
    this.groupNameInput = page.locator('input[name*="name"], #groupName, [data-testid="group-name"]');
    this.groupDescriptionInput = page.locator('textarea[name*="description"], #groupDescription, [data-testid="group-description"]');
    this.addMemberButton = page.locator('button:has-text("Add Member"), [data-testid="add-member"]');
    this.addSessionButton = page.locator('button:has-text("Add Session"), [data-testid="add-session"]');
    this.membersTable = page.locator('table:has(th:has-text("Name")), [data-testid="members-table"]');
    this.sessionsTable = page.locator('table:has(th:has-text("Date")), [data-testid="sessions-table"]');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.sideNavigation = page.locator('nav, .side-nav, .navigation');
  }

  async goto(groupId: string) {
    await this.page.goto(`/groups/${groupId}`);
  }

  async expectToBeOnGroupPage() {
    await TestHelpers.expectUrl(this.page, '/groups/\\w+');
  }

  async expectGroupDetailsVisible() {
    const hasMainContent = await this.mainContent.isVisible().catch(() => false);
    const hasGroupContent = await this.page.locator('h1, h2, text=Group, text=group').first().isVisible().catch(() => false);
    return hasMainContent || hasGroupContent;
  }

  async expectTabsVisible() {
    const hasSettingsTab = await this.settingsTab.isVisible().catch(() => false);
    const hasAnyTab = await this.page.locator('li, button, a').filter({ hasText: /Settings|Members|Sessions/ }).first().isVisible().catch(() => false);
    return hasSettingsTab || hasAnyTab;
  }

  async clickSettingsTab() {
    const settingsTabExists = await this.settingsTab.isVisible().catch(() => false);
    if (settingsTabExists) {
      await this.settingsTab.click();
      return true;
    }
    return false;
  }

  async clickMembersTab() {
    const membersTabExists = await this.membersTab.isVisible().catch(() => false);
    if (membersTabExists) {
      await this.membersTab.click();
      return true;
    }
    return false;
  }

  async clickSessionsTab() {
    const sessionsTabExists = await this.sessionsTab.isVisible().catch(() => false);
    if (sessionsTabExists) {
      await this.sessionsTab.click();
      return true;
    }
    return false;
  }

  async editGroup() {
    const editButtonExists = await this.editButton.isVisible().catch(() => false);
    if (editButtonExists) {
      await this.editButton.click();
      return true;
    }
    return false;
  }

  async saveGroup() {
    const saveButtonExists = await this.saveButton.isVisible().catch(() => false);
    if (saveButtonExists) {
      await this.saveButton.click();
      return true;
    }
    return false;
  }

  async cancelEdit() {
    const cancelButtonExists = await this.cancelButton.isVisible().catch(() => false);
    if (cancelButtonExists) {
      await this.cancelButton.click();
      return true;
    }
    return false;
  }

  async addMember() {
    const addMemberButtonExists = await this.addMemberButton.isVisible().catch(() => false);
    if (addMemberButtonExists) {
      await this.addMemberButton.click();
      return true;
    }
    return false;
  }

  async addSession() {
    const addSessionButtonExists = await this.addSessionButton.isVisible().catch(() => false);
    if (addSessionButtonExists) {
      await this.addSessionButton.click();
      return true;
    }
    return false;
  }

  async expectMembersTableVisible() {
    return await this.membersTable.isVisible().catch(() => false);
  }

  async expectSessionsTableVisible() {
    return await this.sessionsTable.isVisible().catch(() => false);
  }

  async getMembersCount() {
    const membersTableExists = await this.expectMembersTableVisible();
    if (membersTableExists) {
      return await this.page.locator('table tbody tr, .member-row').count();
    }
    return 0;
  }

  async getSessionsCount() {
    const sessionsTableExists = await this.expectSessionsTableVisible();
    if (sessionsTableExists) {
      return await this.page.locator('table tbody tr, .session-row').count();
    }
    return 0;
  }

  async expectAddMemberAvailable() {
    return await this.addMemberButton.isVisible().catch(() => false);
  }

  async expectAddSessionAvailable() {
    return await this.addSessionButton.isVisible().catch(() => false);
  }

  async expectEditGroupAvailable() {
    return await this.editButton.isVisible().catch(() => false);
  }
}