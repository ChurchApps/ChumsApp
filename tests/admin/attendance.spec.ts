import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { AttendancePage } from '../pages/attendance-page';
import { SharedSetup } from '../utils/shared-setup';
import { AttendanceTestHelpers } from './attendance-test-helpers';

test.describe('Attendance Page', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let attendancePage: AttendancePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    attendancePage = new AttendancePage(page);
  });

  test('should check if attendance page is accessible', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'attendance page accessibility', attendancePage, async () => {
      await AttendanceTestHelpers.testPageAccessibility(page, 'attendanceManagement');
    });
  });

  test('should display attendance setup by default', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'attendance setup display', attendancePage, async () => {
      await AttendanceTestHelpers.testAttendanceDisplay(page, attendancePage);
    });
  });

  test('should display navigation tabs', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'attendance navigation tabs', attendancePage, async () => {
      const hasSideNav = await attendancePage.expectSideNavVisible();
      expect(hasSideNav).toBeTruthy();
      console.log('Attendance navigation tabs displayed successfully');
    });
  });

  test('should handle setup tab functionality', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'setup tab functionality', attendancePage, async () => {
      const setupTabClicked = await attendancePage.clickSetupTab();
      expect(setupTabClicked).toBeTruthy();
      
      const hasAttendanceDisplay = await attendancePage.expectAttendanceDisplayed();
      expect(hasAttendanceDisplay).toBeTruthy();
      console.log('Setup tab content displayed successfully');
    });
  });

  test('should handle attendance trend tab', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'attendance trend tab', attendancePage, async () => {
      const trendTabClicked = await attendancePage.clickAttendanceTrendTab();
      expect(trendTabClicked).toBeTruthy();
      console.log('Attendance Trend tab accessible');
    });
  });

  test('should handle group attendance tab', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'group attendance tab', attendancePage, async () => {
      const groupTabClicked = await attendancePage.clickGroupAttendanceTab();
      expect(groupTabClicked).toBeTruthy();
      console.log('Group Attendance tab accessible');
    });
  });

  test('should have add functionality with menu options', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'add functionality', attendancePage, async () => {
      await AttendanceTestHelpers.testAddMenuFunctionality(page, attendancePage);
    });
  });

  test('should have campus creation functionality', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'campus creation functionality', attendancePage, async () => {
      await AttendanceTestHelpers.testCampusFunctionality(page, attendancePage);
    });
  });

  test('should have service creation functionality', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'service creation functionality', attendancePage, async () => {
      await AttendanceTestHelpers.testServiceFunctionality(page, attendancePage);
    });
  });

  test('should have service time creation functionality', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'service time creation functionality', attendancePage, async () => {
      await AttendanceTestHelpers.testServiceTimeFunctionality(page, attendancePage);
    });
  });

  test('should handle attendance hierarchy setup', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'attendance hierarchy setup', attendancePage, async () => {
      await AttendanceTestHelpers.testAttendanceHierarchy(page, attendancePage);
    });
  });

  test('should handle attendance editing functionality', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'attendance editing', attendancePage, async () => {
      await AttendanceTestHelpers.testAttendanceEditing(page, attendancePage);
    });
  });

  test('should maintain page functionality across tabs', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'page functionality across tabs', attendancePage, async () => {
      // Test all tabs work
      await AttendanceTestHelpers.testAttendanceTabs(page, attendancePage);
      
      // Page should still be functional
      const hasSideNav = await attendancePage.expectSideNavVisible();
      expect(hasSideNav).toBeTruthy();
      console.log('Attendance functionality maintained across tab switches');
    });
  });

  test('should handle page navigation via URL', async ({ page }) => {
    await SharedSetup.navigateToPage(page, '/attendance');
    await attendancePage.expectToBeOnAttendancePage();
    console.log('Successfully navigated to attendance page via URL');
  });

  test('should handle empty attendance data gracefully', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'empty attendance data', attendancePage, async () => {
      await attendancePage.expectLoadingComplete();
      
      // Should not crash or show errors even with no data
      const hasDisplay = await attendancePage.expectAttendanceDisplayed();
      expect(hasDisplay).toBeTruthy();
      console.log('Empty attendance data handled gracefully');
    });
  });

  test('should have accessible attendance elements', async ({ page }) => {
    await AttendanceTestHelpers.performAttendancePageTest(page, 'attendance accessibility', attendancePage, async () => {
      // Check for proper attendance structure
      const sideNavExists = await attendancePage.sideNav.isVisible().catch(() => false);
      const attendanceGroupsExists = await attendancePage.attendanceGroups.isVisible().catch(() => false);
      const mainContentExists = await attendancePage.mainContent.isVisible().catch(() => false);
      
      expect(sideNavExists || attendanceGroupsExists || mainContentExists).toBeTruthy();
      console.log('Attendance elements are accessible');
    });
  });

  test('should handle invalid attendance URL gracefully', async ({ page }) => {
    // Try to navigate to attendance with invalid query params
    await SharedSetup.navigateToPage(page, '/attendance?invalid=true');
    
    // Should either redirect or show page gracefully
    const currentUrl = page.url();
    
    // Check if we're on attendance page or if error is handled
    const isOnAttendancePage = currentUrl.includes('/attendance');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    expect(isOnAttendancePage || hasErrorMessage).toBeTruthy();
    console.log('Invalid attendance URL handled gracefully');
  });
});