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
    await GroupsTestHelpers.performGroupsPageTest(page, 'Add group functionality', groupsPage, async () => {
      await GroupsTestHelpers.testAddGroup(page, groupsPage);
    });
  });

  test('should edit existing group details', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Edit group functionality', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupEditing(page, groupsPage, groupPage);
    });
  });

  test('should handle group members management', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group members management', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupNavigation(page, groupsPage, groupPage);
      await GroupsTestHelpers.testGroupMembers(page, groupPage);
    });
  });

  test('should handle group sessions management', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group sessions management', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupNavigation(page, groupsPage, groupPage);
      await GroupsTestHelpers.testGroupSessions(page, groupPage);
    });
  });
});