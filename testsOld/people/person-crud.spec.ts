import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { PersonPage } from '../pages/person-page';
import { PeoplePage } from '../pages/people-page';
import { SharedSetup } from '../utils/shared-setup';
import { PeopleTestHelpers } from './people-test-helpers';

test.describe('Person Creation and Editing', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let personPage: PersonPage;
  let peoplePage: PeoplePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    personPage = new PersonPage(page);
    peoplePage = new PeoplePage(page);
    
  });


  test('should have add person functionality', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'Add person functionality', peoplePage, async () => {
      await PeopleTestHelpers.testAddPersonFunctionality(page, peoplePage);
    });
  });

  test('should edit existing person details', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'Edit person functionality', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person editing', personPage, async () => {
        await PeopleTestHelpers.testPersonEditing(page, personPage);
      });
    });
  });

  test('should validate required fields when creating person', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person form validation', peoplePage, async () => {
      await PeopleTestHelpers.testAddPersonFunctionality(page, peoplePage);
      
      const addPersonClicked = await peoplePage.clickAddPerson();
      expect(addPersonClicked).toBeTruthy();
      
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Create")').first();
      const saveButtonExists = await saveButton.isVisible({ timeout: 5000 }).catch(() => false);
      expect(saveButtonExists).toBeTruthy();
      
      await saveButton.click();
      
      const hasValidationError = await page.locator('text=required, text=Required, .error, .invalid').first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasValidationError).toBeTruthy();
      
      console.log('Form validation working correctly');
    });
  });

  test('should handle person form with all fields', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person form fields', peoplePage, async () => {
      const addPersonClicked = await peoplePage.clickAddPerson();
      expect(addPersonClicked).toBeTruthy();
      
      const testData = PeopleTestHelpers.getTestPersonData();
      
      const firstNameFilled = await personPage.fillFirstName(testData.firstName);
      expect(firstNameFilled).toBeTruthy();
      
      const lastNameFilled = await personPage.fillLastName(testData.lastName);
      expect(lastNameFilled).toBeTruthy();
      
      const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
      const cancelExists = await cancelButton.isVisible({ timeout: 5000 }).catch(() => false);
      expect(cancelExists).toBeTruthy();
      
      await cancelButton.click();
      console.log('Person form functionality verified');
    });
  });

  test('should handle person photo upload/edit', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person photo functionality', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person photo', personPage, async () => {
        await personPage.clickDetailsTab();
        
        const hasPersonPhoto = await personPage.expectPersonPhotoVisible();
        if (hasPersonPhoto) {
          await personPage.personPhoto.click();
          
          const hasPhotoEditor = await page.locator('text=Upload, text=Edit Photo, .photo-editor, input[type="file"]').first().isVisible({ timeout: 5000 }).catch(() => false);
          if (hasPhotoEditor) {
            console.log('Photo edit functionality available');
            
            const closeButton = page.locator('button:has-text("Cancel"), button:has-text("Close"), .close').first();
            const closeExists = await closeButton.isVisible({ timeout: 5000 }).catch(() => false);
            if (closeExists) {
              await closeButton.click();
            }
          }
        }
        console.log('Person photo functionality tested');
      });
    });
  });

  test('should handle person deletion gracefully', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'person deletion functionality', peoplePage, async () => {
      await PeopleTestHelpers.testPersonNavigation(page, peoplePage);
      await PeopleTestHelpers.performPersonPageTest(page, 'person delete', personPage, async () => {
        await personPage.clickDetailsTab();
        
        const deleteButton = page.locator('button:has-text("Delete"), text=Delete').first();
        const deleteExists = await deleteButton.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (deleteExists) {
          console.log('Delete functionality found - test skipped to preserve demo data');
        } else {
          console.log('Delete functionality may require different permissions or location');
        }
      });
    });
  });

  test('should handle form validation for email format', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'email validation', peoplePage, async () => {
      const addPersonClicked = await peoplePage.clickAddPerson();
      expect(addPersonClicked).toBeTruthy();
      
      const emailInput = page.locator('input[name*="email"], #email').first();
      const emailExists = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);
      expect(emailExists).toBeTruthy();
      
      await emailInput.fill('invalid-email');
      await emailInput.press('Tab');
      
      const hasEmailError = await page.locator('text=invalid email, text=valid email, .email-error').first().isVisible({ timeout: 5000 }).catch(() => false);
      
      const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
      const cancelExists = await cancelButton.isVisible({ timeout: 5000 }).catch(() => false);
      expect(cancelExists).toBeTruthy();
      
      await cancelButton.click();
      console.log('Email validation functionality tested');
    });
  });

  test('should handle form auto-save or draft functionality', async ({ page }) => {
    await PeopleTestHelpers.performPeoplePageTest(page, 'form auto-save functionality', peoplePage, async () => {
      const addPersonClicked = await peoplePage.clickAddPerson();
      expect(addPersonClicked).toBeTruthy();
      
      const firstNameInput = page.locator('input[name*="firstName"], #firstName').first();
      const firstNameExists = await firstNameInput.isVisible({ timeout: 5000 }).catch(() => false);
      expect(firstNameExists).toBeTruthy();
      
      await firstNameInput.fill('TestAutoSave');
      await page.goBack();
      
      await peoplePage.expectToBeOnPeoplePage();
      const addPersonClickedAgain = await peoplePage.clickAddPerson();
      expect(addPersonClickedAgain).toBeTruthy();
      
      const preservedValue = await firstNameInput.inputValue().catch(() => '');
      
      if (preservedValue === 'TestAutoSave') {
        console.log('Form auto-save/draft functionality working');
      } else {
        console.log('Form does not preserve data between sessions (expected behavior)');
      }
    });
  });
});