import { expect, Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class PersonPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Selectors
  get personBanner() { return this.page.locator('.person-banner, [data-testid="person-banner"]'); }
  get personName() { return this.page.locator('h1, .person-name'); }
  get sideNavigation() { return this.page.locator('.sideNav'); }
  get mainContent() { return this.page.locator('#mainContent'); }

  // Navigation tabs
  get detailsTab() { return this.page.locator('a:has-text("Details"), li:has-text("Details")'); }
  get notesTab() { return this.page.locator('a:has-text("Notes"), li:has-text("Notes")'); }
  get attendanceTab() { return this.page.locator('a:has-text("Attendance"), li:has-text("Attendance")'); }
  get donationsTab() { return this.page.locator('a:has-text("Donations"), li:has-text("Donations")'); }
  get groupsTab() { return this.page.locator('a:has-text("Groups"), li:has-text("Groups")'); }

  // Details tab elements
  get editPersonButton() { return this.page.locator('button:has-text("Edit"), .edit-button'); }
  get personPhoto() { return this.page.locator('.person-photo, img[alt*="photo"]'); }
  get personDetails() { return this.page.locator('.person-details, .person-info'); }
  get householdSection() { return this.page.locator('text=Household'); }

  // Form elements (when editing)
  get firstNameInput() { return this.page.locator('input[name="firstName"], #firstName'); }
  get lastNameInput() { return this.page.locator('input[name="lastName"], #lastName'); }
  get emailInput() { return this.page.locator('input[name="email"], #email'); }
  get phoneInput() { return this.page.locator('input[name="phone"], #phone'); }
  get saveButton() { return this.page.locator('button:has-text("Save")'); }
  get cancelButton() { return this.page.locator('button:has-text("Cancel")'); }

  // Actions
  async goto(personId: string) {
    await this.page.goto(`/people/${personId}`);
    await TestHelpers.waitForPageLoad(this.page);
  }

  async clickDetailsTab() {
    const tabExists = await this.detailsTab.first().isVisible().catch(() => false);
    if (tabExists) {
      await TestHelpers.clickAndWait(this.page, this.detailsTab.first());
    }
    return tabExists;
  }

  async clickNotesTab() {
    const tabExists = await this.notesTab.first().isVisible().catch(() => false);
    if (tabExists) {
      await TestHelpers.clickAndWait(this.page, this.notesTab.first());
    }
    return tabExists;
  }

  async clickAttendanceTab() {
    const tabExists = await this.attendanceTab.first().isVisible().catch(() => false);
    if (tabExists) {
      await TestHelpers.clickAndWait(this.page, this.attendanceTab.first());
    }
    return tabExists;
  }

  async clickDonationsTab() {
    const tabExists = await this.donationsTab.first().isVisible().catch(() => false);
    if (tabExists) {
      await TestHelpers.clickAndWait(this.page, this.donationsTab.first());
    }
    return tabExists;
  }

  async clickGroupsTab() {
    const tabExists = await this.groupsTab.first().isVisible().catch(() => false);
    if (tabExists) {
      await TestHelpers.clickAndWait(this.page, this.groupsTab.first());
    }
    return tabExists;
  }

  async editPerson() {
    const editButtonExists = await this.editPersonButton.first().isVisible().catch(() => false);
    if (editButtonExists) {
      await TestHelpers.clickAndWait(this.page, this.editPersonButton.first());
    }
    return editButtonExists;
  }

  async fillPersonDetails(details: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) {
    if (details.firstName) {
      await this.firstNameInput.fill(details.firstName);
    }
    if (details.lastName) {
      await this.lastNameInput.fill(details.lastName);
    }
    if (details.email) {
      await this.emailInput.fill(details.email);
    }
    if (details.phone) {
      await this.phoneInput.fill(details.phone);
    }
  }

  async savePerson() {
    const saveButtonExists = await this.saveButton.first().isVisible().catch(() => false);
    if (saveButtonExists) {
      await TestHelpers.clickAndWait(this.page, this.saveButton.first());
      await TestHelpers.waitForPageLoad(this.page);
    }
    return saveButtonExists;
  }

  async cancelEdit() {
    const cancelButtonExists = await this.cancelButton.first().isVisible().catch(() => false);
    if (cancelButtonExists) {
      await TestHelpers.clickAndWait(this.page, this.cancelButton.first());
    }
    return cancelButtonExists;
  }

  // Assertions
  async expectToBeOnPersonPage() {
    await TestHelpers.expectUrl(this.page, /\/people\/\w+/);
    await expect(this.sideNavigation).toBeVisible({ timeout: 10000 });
  }

  async expectPersonDetailsVisible() {
    await expect(this.mainContent).toBeVisible();
    
    // Check for either person details or navigation
    const hasDetails = await this.personDetails.isVisible().catch(() => false);
    const hasNavigation = await this.sideNavigation.isVisible().catch(() => false);
    
    expect(hasDetails || hasNavigation).toBeTruthy();
  }

  async expectTabsVisible() {
    await expect(this.sideNavigation).toBeVisible();
    
    // At least details tab should be visible
    const detailsVisible = await this.detailsTab.first().isVisible().catch(() => false);
    expect(detailsVisible).toBeTruthy();
  }

  async expectEditMode() {
    const hasEditForm = await this.firstNameInput.isVisible().catch(() => false) ||
                       await this.saveButton.isVisible().catch(() => false);
    expect(hasEditForm).toBeTruthy();
  }
}