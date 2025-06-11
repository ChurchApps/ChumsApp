import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { GroupsPage } from '../pages/groups-page';
import { SharedSetup } from '../utils/shared-setup';
import { GroupsTestHelpers } from './groups-test-helpers';

test.describe('Groups Search', () => {
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

  test('should perform basic group search', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'basic group search', groupsPage, async () => {
      await GroupsTestHelpers.testGroupsSearch(page, groupsPage, 'Group');
    });
  });

  test('should handle partial name searches', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'partial name search', groupsPage, async () => {
      await GroupsTestHelpers.testGroupsSearch(page, groupsPage, 'Gr');
    });
  });

  test('should handle case-insensitive searches', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'case-insensitive search', groupsPage, async () => {
      await GroupsTestHelpers.testGroupsSearch(page, groupsPage, 'group');
    });
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'empty search handling', groupsPage, async () => {
      await GroupsTestHelpers.testGroupsSearch(page, groupsPage, '');
    });
  });
});