import { Page, expect } from '@playwright/test';
import { ProfilePage } from '../pages/profile-page';
import { DevicesPage } from '../pages/devices-page';

export class ProfileTestHelpers {
  
  /**
   * Main helper for testing profile page functionality - expects it to work
   */
  static async performProfilePageTest(
    page: Page, 
    testName: string, 
    profilePage: ProfilePage, 
    testFunction: () => Promise<void>
  ) {
    await profilePage.goto();
    await profilePage.expectToBeOnProfilePage();
    await testFunction();
    console.log(`${testName} verified on profile page`);
  }

  /**
   * Helper for testing devices page functionality - expects it to work
   */
  static async performDevicesPageTest(
    page: Page, 
    testName: string, 
    devicesPage: DevicesPage, 
    testFunction: () => Promise<void>
  ) {
    await devicesPage.goto();
    await devicesPage.expectToBeOnDevicesPage();
    await testFunction();
    console.log(`${testName} verified on devices page`);
  }

  /**
   * Helper for CRUD operations that require profile management permissions
   */
  static async performProfileCrudTest(
    page: Page, 
    testName: string, 
    profilePage: ProfilePage, 
    testFunction: () => Promise<void>
  ) {
    await profilePage.goto();
    await profilePage.expectToBeOnProfilePage();
    await testFunction();
    console.log(`${testName} verified on profile page`);
  }

  /**
   * Helper to test profile form functionality
   */
  static async testProfileFormFunctionality(page: Page, profilePage: ProfilePage) {
    console.log('Testing profile form functionality');
    
    await profilePage.expectLoadingComplete();
    
    const hasForm = await profilePage.expectProfileFormVisible();
    expect(hasForm).toBeTruthy();
    
    const firstName = await profilePage.getFirstNameValue();
    const lastName = await profilePage.getLastNameValue();
    const email = await profilePage.getEmailValue();
    
    console.log(`Current profile: ${firstName} ${lastName} (${email})`);
    
    const firstNameFilled = await profilePage.fillFirstName('Test');
    expect(firstNameFilled).toBeTruthy();
    
    const lastNameFilled = await profilePage.fillLastName('User');
    expect(lastNameFilled).toBeTruthy();
    
    const saveAvailable = await profilePage.saveButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(saveAvailable).toBeTruthy();
    
    console.log('Profile form functionality verified');
    return true;
  }

  /**
   * Helper to test password change functionality
   */
  static async testPasswordChangeFunctionality(page: Page, profilePage: ProfilePage) {
    console.log('Testing password change functionality');
    
    const currentPasswordExists = await profilePage.currentPasswordInput.isVisible({ timeout: 5000 }).catch(() => false);
    expect(currentPasswordExists).toBeTruthy();
    
    const newPasswordExists = await profilePage.newPasswordInput.isVisible({ timeout: 5000 }).catch(() => false);
    expect(newPasswordExists).toBeTruthy();
    
    const confirmPasswordExists = await profilePage.confirmPasswordInput.isVisible({ timeout: 5000 }).catch(() => false);
    expect(confirmPasswordExists).toBeTruthy();
    
    const changePasswordAvailable = await profilePage.changePasswordButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(changePasswordAvailable).toBeTruthy();
    
    console.log('Password change functionality verified');
    return true;
  }

  /**
   * Helper to test notification preferences functionality
   */
  static async testNotificationPreferences(page: Page, profilePage: ProfilePage) {
    console.log('Testing notification preferences');
    
    const hasNotificationPrefs = await profilePage.expectNotificationPreferencesVisible();
    
    if (hasNotificationPrefs) {
      console.log('Notification preferences section visible');
      
      // Test push notification settings
      const pushNotificationSet = await profilePage.setPushNotificationPreference('1');
      if (pushNotificationSet) {
        console.log('Push notification preference setting available');
      }
      
      // Test email frequency settings
      const emailFrequencySet = await profilePage.setEmailFrequencyPreference('daily');
      if (emailFrequencySet) {
        console.log('Email frequency preference setting available');
      }
      
      return true;
    } else {
      console.log('Notification preferences may be structured differently');
    }
    
    return false;
  }

  /**
   * Helper to test linked accounts functionality
   */
  static async testLinkedAccounts(page: Page, profilePage: ProfilePage) {
    console.log('Testing linked accounts');
    
    const hasLinkedAccounts = await profilePage.expectLinkedAccountsVisible();
    
    if (hasLinkedAccounts) {
      console.log('Linked accounts section visible');
      
      // Test PraiseCharts linking (don't actually link in demo)
      const linkAvailable = await profilePage.praiseChartsLink.isVisible().catch(() => false);
      const unlinkAvailable = await profilePage.praiseChartsUnlink.isVisible().catch(() => false);
      
      if (linkAvailable) {
        console.log('PraiseCharts link functionality available');
      }
      
      if (unlinkAvailable) {
        console.log('PraiseCharts unlink functionality available');
      }
      
      return linkAvailable || unlinkAvailable;
    } else {
      console.log('Linked accounts may be structured differently');
    }
    
    return false;
  }

  /**
   * Helper to test device pairing functionality
   */
  static async testDevicePairing(page: Page, devicesPage: DevicesPage) {
    console.log('Testing device pairing functionality');
    
    // Test add device functionality
    const addDeviceClicked = await devicesPage.clickAddDevice();
    
    if (addDeviceClicked) {
      console.log('Add device functionality available');
      
      // Check if pairing modal/form opened
      const pairModalVisible = await devicesPage.expectPairModalVisible();
      const pairCodeVisible = await devicesPage.pairCodeInput.isVisible().catch(() => false);
      
      if (pairModalVisible || pairCodeVisible) {
        console.log('Device pairing interface opened');
        
        // Test filling pair code (but don't actually pair)
        const codeFilled = await devicesPage.fillPairCode('TEST123');
        if (codeFilled) {
          console.log('Pairing code input accessible');
        }
        
        // Test pair button
        const pairButtonAvailable = await devicesPage.pairButton.isVisible().catch(() => false);
        if (pairButtonAvailable) {
          console.log('Pair button available');
        }
        
        return true;
      }
    } else {
      console.log('Add device functionality not available - may require permissions');
    }
    
    return false;
  }

  /**
   * Helper to test device management functionality
   */
  static async testDeviceManagement(page: Page, devicesPage: DevicesPage) {
    console.log('Testing device management functionality');
    
    await devicesPage.expectLoadingComplete();
    
    const hasDevicesDisplay = await devicesPage.expectDevicesDisplayed();
    
    if (hasDevicesDisplay) {
      console.log('Devices display accessible');
      
      const devicesCount = await devicesPage.getDevicesCount();
      console.log(`Found ${devicesCount} devices`);
      
      if (devicesCount > 0) {
        // Test device editing
        const editClicked = await devicesPage.editFirstDevice();
        
        if (editClicked) {
          console.log('Device edit functionality available');
          
          // Check if edit modal/form opened
          const editModalVisible = await devicesPage.expectEditModalVisible();
          const labelVisible = await devicesPage.deviceLabelInput.isVisible().catch(() => false);
          
          if (editModalVisible || labelVisible) {
            console.log('Device edit interface opened');
            
            // Test device content management
            const contentVisible = await devicesPage.expectDeviceContentVisible();
            if (contentVisible) {
              console.log('Device content management available');
              
              const checkboxCount = await devicesPage.getClassroomCheckboxCount();
              console.log(`Found ${checkboxCount} classroom associations`);
            }
            
            return true;
          }
        }
      } else {
        console.log('No devices available for management testing');
      }
      
      return true;
    } else {
      console.log('Devices display may be structured differently');
    }
    
    return false;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    const components = {
      profileManagement: {
        title: 'h1:has-text("Profile"), h1:has-text("Account")',
        content: 'form, input, #mainContent'
      },
      deviceManagement: {
        title: 'h1:has-text("Devices"), h1:has-text("Device")',
        content: 'table, .devices, #mainContent'
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
   * Helper to test form validation
   */
  static async testFormValidation(page: Page, profilePage: ProfilePage) {
    console.log('Testing form validation');
    
    // Test with invalid data to trigger validation
    const emailFilled = await profilePage.fillEmail('invalid-email');
    
    if (emailFilled) {
      // Try to save with invalid data
      const saveClicked = await profilePage.clickSave();
      
      if (saveClicked) {
        // Check for validation errors
        const hasErrors = await profilePage.expectErrorMessages();
        
        if (hasErrors) {
          console.log('Form validation working - errors displayed');
          return true;
        } else {
          console.log('Form validation may work differently');
        }
      }
    }
    
    return false;
  }

  /**
   * Helper to test account deletion functionality
   */
  static async testAccountDeletion(page: Page, profilePage: ProfilePage) {
    console.log('Testing account deletion functionality');
    
    const deleteButtonAvailable = await profilePage.deleteAccountButton.isVisible().catch(() => false);
    
    if (deleteButtonAvailable) {
      console.log('Delete account functionality available');
      
      // Don't actually click delete in demo, just verify it's there
      return true;
    } else {
      console.log('Delete account functionality not visible - may require permissions');
    }
    
    return false;
  }

  /**
   * Common test data for profile testing
   */
  static getTestData() {
    return {
      profile: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        invalidEmail: 'invalid-email'
      },
      passwords: {
        current: 'currentpass123',
        new: 'newpass123',
        confirm: 'newpass123',
        mismatch: 'different123'
      },
      devices: {
        validPairCode: 'ABC123',
        invalidPairCode: 'INVALID',
        deviceLabel: 'Test Device'
      },
      notifications: {
        pushEnabled: '1',
        pushDisabled: '0',
        emailNever: 'never',
        emailDaily: 'daily',
        emailIndividual: 'individual'
      }
    };
  }
}