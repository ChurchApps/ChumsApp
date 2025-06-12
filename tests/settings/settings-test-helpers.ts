import { Page, expect } from '@playwright/test';
import { SettingsPage } from '../pages/settings-page';
import { RolePage } from '../pages/role-page';
import { SharedSetup } from '../utils/shared-setup';

export class SettingsTestHelpers {
  
  /**
   * Main helper for testing settings page functionality - expects it to work
   */
  static async performSettingsPageTest(
    page: Page, 
    testName: string, 
    settingsPage: SettingsPage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/settings');
    await settingsPage.expectToBeOnSettingsPage();
    await testFunction();
    console.log(`${testName} verified on settings page`);
  }

  /**
   * Helper for CRUD operations that require settings management permissions
   */
  static async performCrudTest(
    page: Page, 
    testName: string, 
    settingsPage: SettingsPage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/settings');
    await settingsPage.expectToBeOnSettingsPage();
    await testFunction();
    console.log(`${testName} verified on settings page`);
  }

  /**
   * Helper for role page navigation tests - expects it to work
   */
  static async performRolePageTest(
    page: Page, 
    testName: string, 
    settingsPage: SettingsPage, 
    rolePage: RolePage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/settings');
    await settingsPage.expectToBeOnSettingsPage();
    await testFunction();
    console.log(`${testName} verified`);
  }

  /**
   * Helper to test church settings functionality
   */
  static async testChurchSettings(page: Page, settingsPage: SettingsPage) {
    console.log('Testing church settings functionality');
    
    // Ensure we're on settings tab
    await settingsPage.clickSettingsTab();
    await page.waitForLoadState('domcontentloaded');
    
    // Test edit functionality
    const editClicked = await settingsPage.clickEdit();
    
    if (editClicked) {
      console.log('Church settings edit mode accessible');
      
      // Test form fields
      const testData = this.getTestData().church;
      const nameFilled = await settingsPage.fillChurchName(testData.name);
      const subdomainFilled = await settingsPage.fillSubdomain(testData.subdomain);
      const addressFilled = await settingsPage.fillAddress(testData.address);
      
      if (nameFilled || subdomainFilled || addressFilled) {
        console.log('Church settings form fields accessible');
        
        // Test save/cancel functionality (don't actually save in demo)
        const saveAvailable = await settingsPage.saveButton.isVisible().catch(() => false);
        const cancelAvailable = await settingsPage.cancelButton.isVisible().catch(() => false);
        
        if (saveAvailable) {
          console.log('Save church settings functionality available');
        }
        
        if (cancelAvailable) {
          console.log('Cancel church settings functionality available');
        }
        
        return true;
      }
    } else {
      console.log('Church settings edit not available - may require permissions');
    }
    
    return false;
  }

  /**
   * Helper to test settings tabs functionality
   */
  static async testSettingsTabs(page: Page, settingsPage: SettingsPage) {
    const settingsTabClicked = await settingsPage.clickSettingsTab();
    const rolesTabClicked = await settingsPage.clickRolesTab();
    
    let tabsWorking = false;
    
    if (settingsTabClicked) {
      console.log('Settings tab accessible');
      tabsWorking = true;
    }
    
    if (rolesTabClicked) {
      console.log('Roles tab accessible');
      
      const hasRoles = await settingsPage.expectRolesTableVisible();
      
      if (hasRoles) {
        console.log('Roles table displayed');
        
        const rolesCount = await settingsPage.getRolesCount();
        console.log(`Found ${rolesCount} roles`);
      }
      
      tabsWorking = true;
    }
    
    return tabsWorking;
  }

  /**
   * Helper to test role management functionality
   */
  static async testRoleManagement(page: Page, settingsPage: SettingsPage) {
    console.log('Testing role management functionality');
    
    // Ensure we're on roles tab
    await settingsPage.clickRolesTab();
    await page.waitForLoadState('domcontentloaded');
    
    const hasRoles = await settingsPage.expectRolesTableVisible();
    
    if (hasRoles) {
      console.log('Roles management accessible');
      
      const rolesCount = await settingsPage.getRolesCount();
      console.log(`Found ${rolesCount} roles`);
      
      // Test add role functionality
      const addRoleClicked = await settingsPage.clickAddRole();
      if (addRoleClicked) {
        console.log('Add role functionality available');
      }
      
      if (rolesCount > 0) {
        // Test role navigation
        const roleClicked = await settingsPage.clickFirstRole();
        if (roleClicked) {
          console.log('Role navigation functionality available');
        }
        
        // Test role editing
        const editClicked = await settingsPage.editFirstRole();
        if (editClicked) {
          console.log('Role edit functionality available');
        }
      }
      
      return true;
    } else {
      console.log('Roles management may be structured differently');
    }
    
    return false;
  }

  /**
   * Helper to test import/export functionality
   */
  static async testImportExport(page: Page, settingsPage: SettingsPage) {
    console.log('Testing import/export functionality');
    
    const hasImportExport = await settingsPage.expectImportExportLinksVisible();
    
    if (hasImportExport) {
      console.log('Import/Export links accessible');
      
      // Test import functionality (don't actually import)
      const importClicked = await settingsPage.clickImport();
      if (importClicked) {
        console.log('Import functionality available');
      }
      
      // Test export functionality
      const exportClicked = await settingsPage.clickExport();
      if (exportClicked) {
        console.log('Export functionality available');
      }
      
      return true;
    } else {
      console.log('Import/Export functionality not available or structured differently');
    }
    
    return false;
  }

  /**
   * Helper to test role page functionality
   */
  static async testRolePageFunctionality(page: Page, rolePage: RolePage) {
    console.log('Testing role page functionality');
    
    await rolePage.expectLoadingComplete();
    
    const hasRoleDetails = await rolePage.expectRoleDetailsVisible();
    
    if (hasRoleDetails) {
      console.log('Role page details accessible');
      
      // Test role members section
      const hasMembers = await rolePage.expectRoleMembersVisible();
      if (hasMembers) {
        console.log('Role members section available');
        
        const membersCount = await rolePage.getMembersCount();
        console.log(`Found ${membersCount} role members`);
      }
      
      // Test user management section
      const hasUserManagement = await rolePage.expectUserManagementVisible();
      if (hasUserManagement) {
        console.log('User management section available');
        
        const addUserClicked = await rolePage.clickAddUser();
        if (addUserClicked) {
          console.log('Add user functionality available');
        }
      }
      
      // Test permissions section
      const hasPermissions = await rolePage.expectPermissionsVisible();
      if (hasPermissions) {
        console.log('Permissions section available');
        
        const permissionsCount = await rolePage.getPermissionCheckboxCount();
        console.log(`Found ${permissionsCount} permission checkboxes`);
      }
      
      return true;
    } else {
      console.log('Role page may be structured differently');
    }
    
    return false;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    const components = {
      settingsManagement: {
        title: 'h1:has-text("Settings"), h1:has-text("Church")',
        content: '.sideNav, form, #mainContent'
      },
      roleManagement: {
        title: 'h1:has-text("Role"), h2:has-text("Role")',
        content: '.role-members, .permissions, #mainContent'
      },
      navigation: {
        title: 'h1',
        content: '#mainContent'
      }
    };

    const config = components[componentType] || components.navigation;
    
    const hasTitle = await page.locator(config.title).first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasContent = await page.locator(config.content).first().isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(hasTitle || hasContent).toBeTruthy();
    console.log(`${componentType} page accessible and main components visible`);
    return true;
  }

  /**
   * Common test data for settings testing
   */
  static getTestData() {
    return {
      church: {
        name: 'Test Church',
        subdomain: 'testchurch',
        address: '123 Test Street',
        city: 'Test City',
        state: 'TX',
        zip: '12345'
      },
      roles: {
        name: 'Test Role',
        templates: ['Accountant', 'Church Staff', 'Content Admin', 'Lessons Admin']
      },
      users: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        searchTerm: 'John'
      }
    };
  }
}