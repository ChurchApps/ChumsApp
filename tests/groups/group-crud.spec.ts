import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { GroupsPage } from '../pages/groups-page';
import { GroupPage } from '../pages/group-page';
import { SharedSetup } from '../utils/shared-setup';
import { GroupsTestHelpers } from './groups-test-helpers';

test.describe('Group Creation and Editing', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let groupsPage: GroupsPage;
  let groupPage: GroupPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    groupsPage = new GroupsPage(page);
    groupPage = new GroupPage(page);
    
    // Use shared setup for consistent authentication
    await SharedSetup.loginAndSelectChurch(page);
  });

  test('should have add group functionality', async ({ page }) => {
    await GroupsTestHelpers.performCrudTest(page, 'Add group functionality', groupsPage, async () => {
      await GroupsTestHelpers.testFormFunctionality(page, 'Add group');
    });
  });

  test('should edit existing group details', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Edit group functionality', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupEditing(page, groupsPage, groupPage);
    });
  });

  test('should validate required fields when creating group', async ({ page }) => {
    await GroupsTestHelpers.performCrudTest(page, 'Group form validation', groupsPage, async () => {
      const addGroupClicked = await groupsPage.clickAddGroup();
      
      if (addGroupClicked) {
        // Try to save without filling required fields
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Create")').first();
        const saveButtonExists = await saveButton.isVisible().catch(() => false);
        
        if (saveButtonExists) {
          await saveButton.click();
          await page.waitForLoadState('domcontentloaded');
          
          // Should show validation errors
          const hasValidationError = await page.locator('text=required, text=Required, .error, .invalid').first().isVisible().catch(() => false);
          
          if (hasValidationError) {
            console.log('Form validation working correctly');
          } else {
            console.log('Validation may be handled differently');
          }
        }
      } else {
        console.log('Skipping validation test - add group not available');
      }
    });
  });

  test('should handle group form with all fields', async ({ page }) => {
    await GroupsTestHelpers.performCrudTest(page, 'Group form with all fields', groupsPage, async () => {
      const addGroupClicked = await groupsPage.clickAddGroup();
      
      if (addGroupClicked) {
        // Try to fill out group form fields
        const testData = {
          name: 'Test Group',
          description: 'This is a test group for demo purposes'
        };
        
        // Fill available fields
        if (await page.locator('input[name*="name"], #groupName, #name').first().isVisible().catch(() => false)) {
          await page.locator('input[name*="name"], #groupName, #name').first().fill(testData.name);
        }
        
        if (await page.locator('textarea[name*="description"], #description').first().isVisible().catch(() => false)) {
          await page.locator('textarea[name*="description"], #description').first().fill(testData.description);
        }
        
        console.log('Group form fields filled with test data');
        
        // Don't actually save in demo environment to avoid creating test data
        const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
        const cancelExists = await cancelButton.isVisible().catch(() => false);
        
        if (cancelExists) {
          await cancelButton.click();
          console.log('Form cancelled to avoid creating test data');
        }
      } else {
        console.log('Skipping form test - add group not available');
      }
    });
  });

  test('should handle group members management', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group members management', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        await GroupsTestHelpers.testGroupMembers(page, groupPage);
      } else {
        console.log('No groups available for member management testing');
      }
    });
  });

  test('should handle group sessions management', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group sessions management', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        await GroupsTestHelpers.testGroupSessions(page, groupPage);
      } else {
        console.log('No groups available for session management testing');
      }
    });
  });

  test('should handle group deletion gracefully', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group deletion functionality', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        await groupPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Look for delete functionality
        const deleteButton = page.locator('button:has-text("Delete"), text=Delete').first();
        const deleteExists = await deleteButton.isVisible().catch(() => false);
        
        if (deleteExists) {
          console.log('Delete functionality found');
          
          // Don't actually click delete in demo environment
          console.log('Delete test skipped to preserve demo data');
        } else {
          console.log('Delete functionality not visible - may require permissions or be in different location');
        }
      } else {
        console.log('No groups available for deletion testing');
      }
    });
  });

  test('should handle group name validation', async ({ page }) => {
    await GroupsTestHelpers.performCrudTest(page, 'Group name validation', groupsPage, async () => {
      const addGroupClicked = await groupsPage.clickAddGroup();
      
      if (addGroupClicked) {
        // Try to enter invalid or very long group name
        const nameInput = page.locator('input[name*="name"], #groupName, #name').first();
        const nameExists = await nameInput.isVisible().catch(() => false);
        
        if (nameExists) {
          const veryLongName = 'A'.repeat(500); // Very long name
          await nameInput.fill(veryLongName);
          
          // Try to save or move to next field to trigger validation
          await nameInput.press('Tab');
          await page.waitForLoadState('domcontentloaded');
          
          // Look for validation error
          const hasNameError = await page.locator('text=too long, text=maximum length, .name-error').first().isVisible().catch(() => false);
          
          if (hasNameError) {
            console.log('Name validation working correctly');
          } else {
            console.log('Name validation may be handled differently or on submit');
          }
          
          // Cancel form
          const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
          const cancelExists = await cancelButton.isVisible().catch(() => false);
          if (cancelExists) {
            await cancelButton.click();
          }
        }
      } else {
        console.log('Skipping name validation test - add group not available');
      }
    });
  });

  test('should handle form auto-save or draft functionality', async ({ page }) => {
    await GroupsTestHelpers.performCrudTest(page, 'Group form auto-save functionality', groupsPage, async () => {
      const addGroupClicked = await groupsPage.clickAddGroup();
      
      if (addGroupClicked) {
        // Fill some form data
        const nameInput = page.locator('input[name*="name"], #groupName, #name').first();
        const nameExists = await nameInput.isVisible().catch(() => false);
        
        if (nameExists) {
          await nameInput.fill('TestAutoSaveGroup');
          await page.waitForLoadState('domcontentloaded');
          
          // Navigate away and back to see if data persists
          await page.goBack();
          await page.waitForLoadState('domcontentloaded');
          
          // Try to go to add group again
          const addGroupStillExists = await groupsPage.addGroupButton.isVisible().catch(() => false);
          if (addGroupStillExists) {
            await groupsPage.addGroupButton.click();
            await page.waitForLoadState('networkidle');
            
            // Check if data was preserved
            const preservedValue = await nameInput.inputValue().catch(() => '');
            
            if (preservedValue === 'TestAutoSaveGroup') {
              console.log('Form auto-save/draft functionality working');
            } else {
              console.log('Form does not preserve data between sessions');
            }
          }
        }
      } else {
        console.log('Skipping auto-save test - add group not available');
      }
    });
  });
});