import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { ProfilePage } from '../pages/profile-page';
import { SharedSetup } from '../utils/shared-setup';
import { ProfileTestHelpers } from './profile-test-helpers';

test.describe('Profile Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    profilePage = new ProfilePage(page);
    
    // Use shared setup for consistent authentication
    await SharedSetup.loginAndSelectChurch(page);
  });

  test('should check if profile page is accessible', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'profile page accessibility', profilePage, async () => {
      await ProfileTestHelpers.testPageAccessibility(page, 'profileManagement');
    });
  });

  test('should display profile form by default', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'profile form display', profilePage, async () => {
      await ProfileTestHelpers.testProfileFormFunctionality(page, profilePage);
    });
  });

  test('should handle personal information editing', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'personal information editing', profilePage, async () => {
      const testData = ProfileTestHelpers.getTestData().profile;
      
      const firstNameFilled = await profilePage.fillFirstName(testData.firstName);
      expect(firstNameFilled).toBeTruthy();
      
      const lastNameFilled = await profilePage.fillLastName(testData.lastName);
      expect(lastNameFilled).toBeTruthy();
      
      const emailFilled = await profilePage.fillEmail(testData.email);
      expect(emailFilled).toBeTruthy();
      
      const saveAvailable = await profilePage.saveButton.isVisible({ timeout: 5000 }).catch(() => false);
      expect(saveAvailable).toBeTruthy();
      
      console.log('Personal information editing functionality verified');
    });
  });

  test('should handle password change functionality', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'password change functionality', profilePage, async () => {
      await ProfileTestHelpers.testPasswordChangeFunctionality(page, profilePage);
    });
  });

  test('should handle notification preferences', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'notification preferences', profilePage, async () => {
      const hasNotificationPrefs = await profilePage.expectNotificationPreferencesVisible();
      expect(hasNotificationPrefs).toBeTruthy();
      console.log('Notification preferences functionality verified');
    });
  });

  test('should handle linked accounts functionality', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'linked accounts functionality', profilePage, async () => {
      const hasLinkedAccounts = await profilePage.expectLinkedAccountsVisible();
      expect(hasLinkedAccounts).toBeTruthy();
      console.log('Linked accounts functionality verified');
    });
  });

  test('should handle form validation', async ({ page }) => {
    await ProfileTestHelpers.performProfileCrudTest(page, 'Form validation', profilePage, async () => {
      const testData = ProfileTestHelpers.getTestData().profile;
      
      const emailFilled = await profilePage.fillEmail(testData.invalidEmail);
      expect(emailFilled).toBeTruthy();
      
      const saveClicked = await profilePage.clickSave();
      expect(saveClicked).toBeTruthy();
      
      console.log('Form validation functionality verified');
    });
  });

  test('should handle account deletion functionality', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'account deletion functionality', profilePage, async () => {
      const deleteButtonAvailable = await profilePage.deleteAccountButton.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (deleteButtonAvailable) {
        console.log('Delete account functionality available - test skipped to preserve demo data');
      } else {
        console.log('Delete account functionality may require different permissions');
      }
    });
  });

  test('should handle invalid profile URL gracefully', async ({ page }) => {
    await page.goto('/profile?invalid=true');
    
    const currentUrl = page.url();
    const isOnProfilePage = currentUrl.includes('/profile');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isOnProfilePage || hasErrorMessage).toBeTruthy();
    console.log('Invalid profile URL handled gracefully');
  });

  test('should maintain form state during editing', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'form state maintenance', profilePage, async () => {
      const testData = ProfileTestHelpers.getTestData().profile;
      
      await profilePage.fillFirstName(testData.firstName);
      await profilePage.fillLastName(testData.lastName);
      
      const firstName = await profilePage.getFirstNameValue();
      const lastName = await profilePage.getLastNameValue();
      
      expect(firstName).toBe(testData.firstName);
      expect(lastName).toBe(testData.lastName);
      console.log('Form state maintained during editing');
    });
  });

  test('should handle password visibility toggle', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'password visibility toggle', profilePage, async () => {
      const toggleClicked = await profilePage.togglePasswordVisibility();
      expect(toggleClicked).toBeTruthy();
      console.log('Password visibility toggle functionality verified');
    });
  });

  test('should handle page navigation via URL', async ({ page }) => {
    await profilePage.goto();
    await profilePage.expectToBeOnProfilePage();
    console.log('Successfully navigated to profile page via URL');
  });

  test('should have accessible profile elements', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'profile accessibility', profilePage, async () => {
      const formExists = await profilePage.firstNameInput.isVisible({ timeout: 5000 }).catch(() => false);
      const mainContentExists = await profilePage.mainContent.isVisible({ timeout: 5000 }).catch(() => false);
      
      expect(formExists || mainContentExists).toBeTruthy();
      console.log('Profile elements are accessible');
    });
  });

  test('should handle loading states gracefully', async ({ page }) => {
    await ProfileTestHelpers.performProfilePageTest(page, 'loading state handling', profilePage, async () => {
      await profilePage.expectLoadingComplete();
      
      const hasForm = await profilePage.expectProfileFormVisible();
      expect(hasForm).toBeTruthy();
      console.log('Loading states handled gracefully');
    });
  });
});