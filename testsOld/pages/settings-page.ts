import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class SettingsPage {
  readonly page: Page;
  readonly settingsTab: Locator;
  readonly rolesTab: Locator;
  readonly churchNameInput: Locator;
  readonly subdomainInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly editButton: Locator;
  readonly importLink: Locator;
  readonly exportLink: Locator;
  readonly rolesTable: Locator;
  readonly addRoleButton: Locator;
  readonly addRoleDropdown: Locator;
  readonly roleRows: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessages: Locator;
  readonly successMessages: Locator;
  readonly mainContent: Locator;
  readonly sideNav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsTab = page.locator('.sideNav a:has-text("Settings"), [role="tab"]:has-text("Settings")');
    this.rolesTab = page.locator('.sideNav a:has-text("Roles"), [role="tab"]:has-text("Roles")');
    this.churchNameInput = page.locator('input[name="name"], #churchName, [data-testid="church-name"]');
    this.subdomainInput = page.locator('input[name="subdomain"], #subdomain, [data-testid="subdomain"]');
    this.addressInput = page.locator('input[name="address"], #address, [data-testid="address"]');
    this.cityInput = page.locator('input[name="city"], #city, [data-testid="city"]');
    this.stateInput = page.locator('input[name="state"], #state, [data-testid="state"]');
    this.zipInput = page.locator('input[name="zip"], #zip, [data-testid="zip"]');
    this.saveButton = page.locator('button:has-text("Save"), [data-testid="save-button"]');
    this.cancelButton = page.locator('button:has-text("Cancel"), [data-testid="cancel-button"]');
    this.editButton = page.locator('button:has-text("Edit"), [data-testid="edit-button"]');
    this.importLink = page.locator('a:has-text("Import"), [data-testid="import-link"]');
    this.exportLink = page.locator('a:has-text("Export"), [data-testid="export-link"]');
    this.rolesTable = page.locator('table, [data-testid="roles-table"]');
    this.addRoleButton = page.locator('button:has-text("Add Role"), [data-testid="add-role"]');
    this.addRoleDropdown = page.locator('select[name*="role"], .role-dropdown');
    this.roleRows = page.locator('tbody tr, .role-row');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.errorMessages = page.locator('.error-message, .alert-danger, text=Error');
    this.successMessages = page.locator('.success-message, .alert-success, text=Success');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.sideNav = page.locator('.sideNav');
  }

  async goto() {
    await this.page.goto('/settings');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to settings via menu
    const settingsNavLink = this.page.locator('a[href="/settings"], a:has-text("Settings"), nav a:has-text("Settings")').first();
    const settingsNavExists = await settingsNavLink.isVisible().catch(() => false);
    
    if (settingsNavExists) {
      await settingsNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnSettingsPage() {
    await TestHelpers.expectUrl(this.page, '/settings');
  }

  async expectSideNavVisible() {
    const hasSideNav = await this.sideNav.isVisible().catch(() => false);
    const hasTabNav = await this.page.locator('[role="tab"], .tab').first().isVisible().catch(() => false);
    return hasSideNav || hasTabNav;
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

  async clickRolesTab() {
    const rolesTabExists = await this.rolesTab.isVisible().catch(() => false);
    if (rolesTabExists) {
      await this.rolesTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickEdit() {
    const editButtonExists = await this.editButton.isVisible().catch(() => false);
    if (editButtonExists) {
      await this.editButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async fillChurchName(name: string) {
    const nameExists = await this.churchNameInput.isVisible().catch(() => false);
    if (nameExists) {
      await this.churchNameInput.fill(name);
      return true;
    }
    return false;
  }

  async fillSubdomain(subdomain: string) {
    const subdomainExists = await this.subdomainInput.isVisible().catch(() => false);
    if (subdomainExists) {
      await this.subdomainInput.fill(subdomain);
      return true;
    }
    return false;
  }

  async fillAddress(address: string) {
    const addressExists = await this.addressInput.isVisible().catch(() => false);
    if (addressExists) {
      await this.addressInput.fill(address);
      return true;
    }
    return false;
  }

  async fillCity(city: string) {
    const cityExists = await this.cityInput.isVisible().catch(() => false);
    if (cityExists) {
      await this.cityInput.fill(city);
      return true;
    }
    return false;
  }

  async fillState(state: string) {
    const stateExists = await this.stateInput.isVisible().catch(() => false);
    if (stateExists) {
      await this.stateInput.fill(state);
      return true;
    }
    return false;
  }

  async fillZip(zip: string) {
    const zipExists = await this.zipInput.isVisible().catch(() => false);
    if (zipExists) {
      await this.zipInput.fill(zip);
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

  async expectRolesTableVisible() {
    const hasTable = await this.rolesTable.isVisible().catch(() => false);
    const hasNoRolesMessage = await this.page.locator('text=No roles found, text=No roles available').isVisible().catch(() => false);
    return hasTable || hasNoRolesMessage;
  }

  async getRolesCount() {
    const rows = await this.roleRows.count();
    return rows;
  }

  async clickAddRole() {
    const addButtonExists = await this.addRoleButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addRoleButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async selectRoleTemplate(roleType: string) {
    const dropdownExists = await this.addRoleDropdown.isVisible().catch(() => false);
    if (dropdownExists) {
      await this.addRoleDropdown.selectOption(roleType);
      return true;
    }
    return false;
  }

  async clickFirstRole() {
    const firstRoleLink = this.page.locator('tbody tr:first-child a, .role-row:first-child a').first();
    const firstRoleExists = await firstRoleLink.isVisible().catch(() => false);
    if (firstRoleExists) {
      await firstRoleLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async editFirstRole() {
    const editButton = this.page.locator('tbody tr:first-child button:has-text("Edit"), .role-row:first-child button:has-text("Edit")').first();
    const editButtonExists = await editButton.isVisible().catch(() => false);
    if (editButtonExists) {
      await editButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectImportExportLinksVisible() {
    const hasImport = await this.importLink.isVisible().catch(() => false);
    const hasExport = await this.exportLink.isVisible().catch(() => false);
    return hasImport || hasExport;
  }

  async clickImport() {
    const importExists = await this.importLink.isVisible().catch(() => false);
    if (importExists) {
      await this.importLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickExport() {
    const exportExists = await this.exportLink.isVisible().catch(() => false);
    if (exportExists) {
      await this.exportLink.click();
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

  async getChurchNameValue() {
    const nameExists = await this.churchNameInput.isVisible().catch(() => false);
    if (nameExists) {
      return await this.churchNameInput.inputValue();
    }
    return '';
  }

  async getSubdomainValue() {
    const subdomainExists = await this.subdomainInput.isVisible().catch(() => false);
    if (subdomainExists) {
      return await this.subdomainInput.inputValue();
    }
    return '';
  }

  async testSettingsSearchFromDashboard() {
    // Test if settings search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for settings-related terms
      await dashboardSearchInput.fill('settings');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any settings-related results appear
      const hasSettingsResults = await this.page.locator('text=Settings, text=settings, text=Role, text=role').first().isVisible().catch(() => false);
      return hasSettingsResults;
    }
    
    return false;
  }

  async searchSettingsFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}