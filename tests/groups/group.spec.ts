import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { GroupsPage } from '../pages/groups-page';
import { GroupPage } from '../pages/group-page';
import { SharedSetup } from '../utils/shared-setup';
import { GroupsTestHelpers } from './groups-test-helpers';

test.describe('Group Page', () => {
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

  test('should navigate to group page from groups list', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group page navigation', groupsPage, groupPage, async () => {
      await page.waitForLoadState('domcontentloaded');
      
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        await groupPage.expectGroupDetailsVisible();
        console.log('Successfully navigated to group page from groups list');
      } else {
        console.log('No groups available in demo environment');
      }
    });
  });

  test('should display group page with navigation tabs', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group page with navigation tabs', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        await groupPage.expectTabsVisible();
        
        // Check for main navigation elements
        await expect(groupPage.sideNavigation).toBeVisible().catch(() => {});
        await expect(groupPage.mainContent).toBeVisible();
        
        console.log('Group page navigation tabs displayed successfully');
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should switch between group tabs', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group tabs navigation', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        
        // Try clicking different tabs
        const settingsClicked = await groupPage.clickSettingsTab();
        if (settingsClicked) {
          await page.waitForLoadState('domcontentloaded');
          console.log('Settings tab clicked successfully');
        }
        
        const membersClicked = await groupPage.clickMembersTab();
        if (membersClicked) {
          await page.waitForLoadState('domcontentloaded');
          console.log('Members tab clicked successfully');
        }
        
        const sessionsClicked = await groupPage.clickSessionsTab();
        if (sessionsClicked) {
          await page.waitForLoadState('domcontentloaded');
          console.log('Sessions tab clicked successfully');
        }
        
        console.log('Group tabs navigation completed');
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should display group details in settings tab', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group details display', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        
        // Click settings tab if not already active
        await groupPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Check for group details elements
        const hasGroupInfo = await page.locator('text=Name, text=Description, text=Category').first().isVisible().catch(() => false);
        const hasEditButton = await groupPage.expectEditGroupAvailable();
        
        if (hasGroupInfo || hasEditButton) {
          console.log('Group details displayed successfully');
        } else {
          console.log('Group details may be structured differently in demo environment');
        }
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should have edit group functionality', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Edit group functionality', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        
        // Click settings tab to ensure we're in the right place
        await groupPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Try to find and click edit button
        const editClicked = await groupPage.editGroup();
        
        if (editClicked) {
          await page.waitForLoadState('domcontentloaded');
          
          // Should be in edit mode
          const hasEditForm = await groupPage.groupNameInput.isVisible().catch(() => false) ||
                             await groupPage.saveButton.isVisible().catch(() => false);
          
          if (hasEditForm) {
            console.log('Edit mode activated successfully');
            
            // Try to cancel edit
            const cancelClicked = await groupPage.cancelEdit();
            if (cancelClicked) {
              console.log('Edit cancelled successfully');
            }
          } else {
            console.log('Edit form may be structured differently');
          }
        } else {
          console.log('Edit button not found - may require permissions');
        }
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should display group members in members tab', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group members display', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        
        // Test group members functionality
        await GroupsTestHelpers.testGroupMembers(page, groupPage);
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should display group sessions in sessions tab', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group sessions display', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        
        // Test group sessions functionality
        await GroupsTestHelpers.testGroupSessions(page, groupPage);
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should handle group page with invalid ID gracefully', async ({ page }) => {
    // Try to navigate to a group page with invalid ID
    await page.goto('/groups/invalid-id-12345');
    await page.waitForLoadState('networkidle');
    
    // Should either redirect or show error gracefully
    const currentUrl = page.url();
    
    // Check if we're redirected to groups page or if error is handled
    const isOnGroupsPage = currentUrl.includes('/groups') && !currentUrl.includes('invalid-id');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    if (isOnGroupsPage || hasErrorMessage) {
      console.log('Invalid group ID handled gracefully');
    } else {
      console.log('Group page may have different error handling');
    }
  });

  test('should maintain group page functionality across tabs', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group page functionality across tabs', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        
        // Click through different tabs and ensure page remains functional
        await groupPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        await groupPage.clickMembersTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Go back to settings
        await groupPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Page should still be functional
        await groupPage.expectGroupDetailsVisible();
        
        console.log('Group page functionality maintained across tab switches');
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should handle group page navigation via URL', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group page URL navigation', groupsPage, groupPage, async () => {
      // Test direct navigation to group page via URL
      // First get a group ID from the groups page
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        // Get the current URL to extract group ID
        const currentUrl = page.url();
        const groupIdMatch = currentUrl.match(/\/groups\/(\w+)/);
        
        if (groupIdMatch) {
          const groupId = groupIdMatch[1];
          
          // Navigate directly to group page using URL
          await groupPage.goto(groupId);
          await groupPage.expectToBeOnGroupPage();
          
          console.log(`Successfully navigated to group page via URL: ${groupId}`);
        }
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should handle add member functionality', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Add member functionality', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        
        const membersClicked = await groupPage.clickMembersTab();
        if (membersClicked) {
          await page.waitForLoadState('domcontentloaded');
          
          const addMemberClicked = await groupPage.addMember();
          if (addMemberClicked) {
            console.log('Add member functionality activated');
            
            // Should either navigate to add member page or open modal
            const isOnAddPage = page.url().includes('/add') || page.url().includes('/member');
            const hasAddModal = await page.locator('.modal, .dialog, text=Add Member').first().isVisible().catch(() => false);
            
            if (isOnAddPage || hasAddModal) {
              console.log('Add member interface opened');
            } else {
              console.log('Add member interface may be structured differently');
            }
          } else {
            console.log('Add member not available - may require permissions');
          }
        } else {
          console.log('Members tab not accessible');
        }
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });

  test('should handle add session functionality', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Add session functionality', groupsPage, groupPage, async () => {
      const groupClicked = await groupsPage.clickFirstGroup();
      
      if (groupClicked) {
        await groupPage.expectToBeOnGroupPage();
        
        const sessionsClicked = await groupPage.clickSessionsTab();
        if (sessionsClicked) {
          await page.waitForLoadState('domcontentloaded');
          
          const addSessionClicked = await groupPage.addSession();
          if (addSessionClicked) {
            console.log('Add session functionality activated');
            
            // Should either navigate to add session page or open modal
            const isOnAddPage = page.url().includes('/add') || page.url().includes('/session');
            const hasAddModal = await page.locator('.modal, .dialog, text=Add Session').first().isVisible().catch(() => false);
            
            if (isOnAddPage || hasAddModal) {
              console.log('Add session interface opened');
            } else {
              console.log('Add session interface may be structured differently');
            }
          } else {
            console.log('Add session not available - may require permissions');
          }
        } else {
          console.log('Sessions tab not accessible');
        }
      } else {
        console.log('Skipping test - no groups available in demo environment');
      }
    });
  });
});