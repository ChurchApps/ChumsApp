import { Page, expect } from '@playwright/test';
import { AttendancePage } from '../pages/attendance-page';
import { SharedSetup } from '../utils/shared-setup';

export class AttendanceTestHelpers {
  
  /**
   * Main helper for testing attendance page functionality - expects it to work
   */
  static async performAttendancePageTest(
    page: Page, 
    testName: string, 
    attendancePage: AttendancePage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/attendance');
    await attendancePage.expectToBeOnAttendancePage();
    await testFunction();
    console.log(`${testName} verified on attendance page`);
  }

  /**
   * Helper to test attendance display functionality
   */
  static async testAttendanceDisplay(page: Page, attendancePage: AttendancePage) {
    console.log('Testing attendance display functionality');
    
    await attendancePage.expectLoadingComplete();
    
    const hasSetupDisplay = await attendancePage.expectAttendanceSetupDisplayed();
    expect(hasSetupDisplay).toBeTruthy();
    
    const campusCount = await attendancePage.getCampusCount();
    console.log(`Found ${campusCount} campuses`);
    
    return true;
  }

  /**
   * Helper to test attendance tabs functionality
   */
  static async testAttendanceTabs(page: Page, attendancePage: AttendancePage) {
    console.log('Testing attendance tabs navigation');
    
    const setupTabClicked = await attendancePage.clickSetupTab();
    expect(setupTabClicked).toBeTruthy();
    console.log('Setup tab accessible');
    
    const trendTabClicked = await attendancePage.clickAttendanceTrendTab();
    expect(trendTabClicked).toBeTruthy();
    console.log('Attendance Trend tab accessible');
    
    const groupTabClicked = await attendancePage.clickGroupAttendanceTab();
    expect(groupTabClicked).toBeTruthy();
    console.log('Group Attendance tab accessible');
    
    return true;
  }

  /**
   * Helper to test add menu functionality
   */
  static async testAddMenuFunctionality(page: Page, attendancePage: AttendancePage) {
    const addButtonClicked = await attendancePage.clickAddButton();
    expect(addButtonClicked).toBeTruthy();
    console.log('Add button functionality available');
    
    // Check if add menu options are visible
    const hasCampusOption = await attendancePage.addCampusMenuItem.isVisible().catch(() => false);
    const hasServiceOption = await attendancePage.addServiceMenuItem.isVisible().catch(() => false);
    const hasServiceTimeOption = await attendancePage.addServiceTimeMenuItem.isVisible().catch(() => false);
    
    expect(hasCampusOption || hasServiceOption || hasServiceTimeOption).toBeTruthy();
    
    if (hasCampusOption) console.log('Add Campus option available');
    if (hasServiceOption) console.log('Add Service option available');
    if (hasServiceTimeOption) console.log('Add Service Time option available');
    
    return true;
  }

  /**
   * Helper to test campus functionality
   */
  static async testCampusFunctionality(page: Page, attendancePage: AttendancePage) {
    const addButtonClicked = await attendancePage.clickAddButton();
    expect(addButtonClicked).toBeTruthy();
    
    const campusOptionClicked = await attendancePage.clickAddCampusMenuItem();
    expect(campusOptionClicked).toBeTruthy();
    console.log('Campus creation functionality available');
    
    return true;
  }

  /**
   * Helper to test service functionality
   */
  static async testServiceFunctionality(page: Page, attendancePage: AttendancePage) {
    const addButtonClicked = await attendancePage.clickAddButton();
    expect(addButtonClicked).toBeTruthy();
    
    const serviceOptionClicked = await attendancePage.clickAddServiceMenuItem();
    expect(serviceOptionClicked).toBeTruthy();
    console.log('Service creation functionality available');
    
    return true;
  }

  /**
   * Helper to test service time functionality
   */
  static async testServiceTimeFunctionality(page: Page, attendancePage: AttendancePage) {
    const addButtonClicked = await attendancePage.clickAddButton();
    expect(addButtonClicked).toBeTruthy();
    
    const serviceTimeOptionClicked = await attendancePage.clickAddServiceTimeMenuItem();
    expect(serviceTimeOptionClicked).toBeTruthy();
    console.log('Service time creation functionality available');
    
    return true;
  }

  /**
   * Helper to test attendance hierarchy setup
   */
  static async testAttendanceHierarchy(page: Page, attendancePage: AttendancePage) {
    console.log('Testing attendance hierarchy setup');
    
    await attendancePage.clickSetupTab();
    
    // Test campus creation
    await this.testCampusFunctionality(page, attendancePage);
    
    // Test service creation
    await this.testServiceFunctionality(page, attendancePage);
    
    // Test service time creation
    await this.testServiceTimeFunctionality(page, attendancePage);
    
    console.log('Attendance hierarchy setup verified');
    return true;
  }

  /**
   * Helper to test attendance editing functionality
   */
  static async testAttendanceEditing(page: Page, attendancePage: AttendancePage) {
    await attendancePage.clickSetupTab();
    
    // Test campus editing
    const campusEditClicked = await attendancePage.editFirstCampus();
    expect(campusEditClicked).toBeTruthy();
    console.log('Campus edit functionality available');
    
    return true;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    const components = {
      attendanceManagement: {
        title: 'h1:has-text("Attendance"), h1:has-text("Setup")',
        content: 'table, .attendance-groups, #mainContent'
      },
      attendanceSetup: {
        title: 'h1:has-text("Attendance"), h2:has-text("Setup")',
        content: '.sideNav, .tab, #mainContent'
      },
      navigation: {
        title: 'h1',
        content: '#mainContent'
      }
    };

    const config = components[componentType] || components.navigation;
    
    const hasTitle = await page.locator(config.title).first().isVisible().catch(() => false);
    const hasContent = await page.locator(config.content).first().isVisible().catch(() => false);
    
    expect(hasTitle || hasContent).toBeTruthy();
    console.log(`${componentType} page accessible and main components visible`);
    return true;
  }
}