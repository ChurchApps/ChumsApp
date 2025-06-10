import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class DevicesPage {
  readonly page: Page;
  readonly devicesTable: Locator;
  readonly addDeviceButton: Locator;
  readonly pairCodeInput: Locator;
  readonly pairButton: Locator;
  readonly deviceRows: Locator;
  readonly firstDeviceEditButton: Locator;
  readonly deviceLabelInput: Locator;
  readonly saveDeviceButton: Locator;
  readonly cancelDeviceButton: Locator;
  readonly deleteDeviceButton: Locator;
  readonly deviceContent: Locator;
  readonly classroomCheckboxes: Locator;
  readonly loadingIndicator: Locator;
  readonly emptyStateMessage: Locator;
  readonly mainContent: Locator;
  readonly errorMessages: Locator;
  readonly successMessages: Locator;
  readonly pairModal: Locator;
  readonly editModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.devicesTable = page.locator('table, [data-testid="devices-table"]');
    this.addDeviceButton = page.locator('button:has-text("Add Device"), [data-testid="add-device"]');
    this.pairCodeInput = page.locator('input[name="code"], input[placeholder*="code"], [data-testid="pair-code"]');
    this.pairButton = page.locator('button:has-text("Pair"), [data-testid="pair-button"]');
    this.deviceRows = page.locator('tbody tr, .device-row');
    this.firstDeviceEditButton = page.locator('tbody tr:first-child button:has-text("Edit"), .device-row:first-child button:has-text("Edit")').first();
    this.deviceLabelInput = page.locator('input[name="label"], #deviceLabel, [data-testid="device-label"]');
    this.saveDeviceButton = page.locator('button:has-text("Save"), [data-testid="save-device"]');
    this.cancelDeviceButton = page.locator('button:has-text("Cancel"), [data-testid="cancel-device"]');
    this.deleteDeviceButton = page.locator('button:has-text("Delete"), [data-testid="delete-device"]');
    this.deviceContent = page.locator('.device-content, [data-testid="device-content"]');
    this.classroomCheckboxes = page.locator('input[type="checkbox"]');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.emptyStateMessage = page.locator('text=No devices found, text=No devices available');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.errorMessages = page.locator('.error-message, .alert-danger, text=Error');
    this.successMessages = page.locator('.success-message, .alert-success, text=Success');
    this.pairModal = page.locator('.modal, .dialog, [data-testid="pair-modal"]');
    this.editModal = page.locator('.modal, .dialog, [data-testid="edit-modal"]');
  }

  async goto() {
    await this.page.goto('/profile/devices');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoViaDashboard() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to navigate to devices via profile menu
    const profileNavLink = this.page.locator('a[href="/profile"], a:has-text("Profile")').first();
    const profileNavExists = await profileNavLink.isVisible().catch(() => false);
    
    if (profileNavExists) {
      await profileNavLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      // Then try to navigate to devices
      const devicesNavLink = this.page.locator('a[href="/profile/devices"], a:has-text("Devices")').first();
      const devicesNavExists = await devicesNavLink.isVisible().catch(() => false);
      
      if (devicesNavExists) {
        await devicesNavLink.click();
        await this.page.waitForLoadState('domcontentloaded');
      } else {
        // Fallback to direct navigation
        await this.goto();
      }
    } else {
      // Fallback to direct navigation
      await this.goto();
    }
  }

  async expectToBeOnDevicesPage() {
    await TestHelpers.expectUrl(this.page, '/profile/devices');
  }

  async expectDevicesTableVisible() {
    const hasTable = await this.devicesTable.isVisible().catch(() => false);
    const hasEmptyMessage = await this.emptyStateMessage.isVisible().catch(() => false);
    return hasTable || hasEmptyMessage;
  }

  async expectDevicesDisplayed() {
    await this.page.waitForLoadState('networkidle');
    return await this.expectDevicesTableVisible();
  }

  async clickAddDevice() {
    const addButtonExists = await this.addDeviceButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addDeviceButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async fillPairCode(code: string) {
    const pairCodeExists = await this.pairCodeInput.isVisible().catch(() => false);
    if (pairCodeExists) {
      await this.pairCodeInput.fill(code);
      return true;
    }
    return false;
  }

  async clickPair() {
    const pairButtonExists = await this.pairButton.isVisible().catch(() => false);
    if (pairButtonExists) {
      await this.pairButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async pairDevice(code: string) {
    const addClicked = await this.clickAddDevice();
    if (addClicked) {
      const codeFilled = await this.fillPairCode(code);
      if (codeFilled) {
        return await this.clickPair();
      }
    }
    return false;
  }

  async getDevicesCount() {
    const rows = await this.deviceRows.count();
    return rows;
  }

  async editFirstDevice() {
    const editButtonExists = await this.firstDeviceEditButton.isVisible().catch(() => false);
    if (editButtonExists) {
      await this.firstDeviceEditButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async fillDeviceLabel(label: string) {
    const labelExists = await this.deviceLabelInput.isVisible().catch(() => false);
    if (labelExists) {
      await this.deviceLabelInput.fill(label);
      return true;
    }
    return false;
  }

  async saveDevice() {
    const saveButtonExists = await this.saveDeviceButton.isVisible().catch(() => false);
    if (saveButtonExists) {
      await this.saveDeviceButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async cancelDeviceEdit() {
    const cancelButtonExists = await this.cancelDeviceButton.isVisible().catch(() => false);
    if (cancelButtonExists) {
      await this.cancelDeviceButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async deleteDevice() {
    const deleteButtonExists = await this.deleteDeviceButton.isVisible().catch(() => false);
    if (deleteButtonExists) {
      await this.deleteDeviceButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectDeviceContentVisible() {
    return await this.deviceContent.isVisible().catch(() => false);
  }

  async getClassroomCheckboxCount() {
    const checkboxes = await this.classroomCheckboxes.count();
    return checkboxes;
  }

  async toggleClassroomAssociation(index: number) {
    const checkboxExists = await this.classroomCheckboxes.nth(index).isVisible().catch(() => false);
    if (checkboxExists) {
      await this.classroomCheckboxes.nth(index).click();
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

  async expectPairModalVisible() {
    return await this.pairModal.isVisible().catch(() => false);
  }

  async expectEditModalVisible() {
    return await this.editModal.isVisible().catch(() => false);
  }

  async testDevicesSearchFromDashboard() {
    // Test if devices search is available from dashboard
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
    
    if (dashboardSearchExists) {
      // Try to search for device-related terms
      await dashboardSearchInput.fill('device');
      await dashboardSearchInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Check if any device-related results appear
      const hasDeviceResults = await this.page.locator('text=Device, text=device, text=Pair, text=pair').first().isVisible().catch(() => false);
      return hasDeviceResults;
    }
    
    return false;
  }

  async searchDevicesFromDashboard(searchTerm: string) {
    const dashboardSearchInput = this.page.locator('#searchText, input[placeholder*="Search"]').first();
    await dashboardSearchInput.fill(searchTerm);
    await dashboardSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}