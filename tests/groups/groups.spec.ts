import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { GroupsPage } from '../pages/groups-page';
import { SharedSetup } from '../utils/shared-setup';
import { GroupsTestHelpers } from './groups-test-helpers';

test.describe('Groups Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let groupsPage: GroupsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    groupsPage = new GroupsPage(page);
    
    // Use shared setup for consistent authentication
    await SharedSetup.loginAndSelectChurch(page);
  });

  test('should check if groups page is accessible', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'groups page accessibility', groupsPage, async () => {
      await GroupsTestHelpers.testPageAccessibility(page, 'groupsManagement');
    });
  });

  test('should display groups list by default', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'groups display', groupsPage, async () => {
      await GroupsTestHelpers.testGroupsDisplay(page, groupsPage);
    });
  });

  test('should perform groups search', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'groups search', groupsPage, async () => {
      await GroupsTestHelpers.testGroupsSearch(page, groupsPage, 'Group');
    });
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'empty search handling', groupsPage, async () => {
      await GroupsTestHelpers.testGroupsSearch(page, groupsPage, '');
    });
  });

  test('should add new group', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'add group', groupsPage, async () => {
      await GroupsTestHelpers.testAddGroup(page, groupsPage);
    });
  });






});