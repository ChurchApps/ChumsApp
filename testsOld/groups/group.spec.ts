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
    
  });

  test('should navigate to group page from groups list', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group page navigation', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupNavigation(page, groupsPage, groupPage);
    });
  });

  test('should display group page with navigation tabs', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group page with navigation tabs', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupNavigation(page, groupsPage, groupPage);
      await GroupsTestHelpers.testGroupTabs(page, groupPage);
    });
  });

  test('should switch between group tabs', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group tabs navigation', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupNavigation(page, groupsPage, groupPage);
      await GroupsTestHelpers.testGroupTabs(page, groupPage);
    });
  });


  test('should have edit group functionality', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Edit group functionality', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupEditing(page, groupsPage, groupPage);
    });
  });

  test('should display group members in members tab', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group members display', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupNavigation(page, groupsPage, groupPage);
      await GroupsTestHelpers.testGroupMembers(page, groupPage);
    });
  });

  test('should display group sessions in sessions tab', async ({ page }) => {
    await GroupsTestHelpers.performGroupPageTest(page, 'Group sessions display', groupsPage, groupPage, async () => {
      await GroupsTestHelpers.testGroupNavigation(page, groupsPage, groupPage);
      await GroupsTestHelpers.testGroupSessions(page, groupPage);
    });
  });





});