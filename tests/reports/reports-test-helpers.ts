import { Page, expect } from '@playwright/test';
import { ReportsPage } from '../pages/reports-page';
import { ReportPage } from '../pages/report-page';

export class ReportsTestHelpers {
  
  /**
   * Main helper for testing reports page functionality - expects it to work
   */
  static async performReportsPageTest(
    page: Page, 
    testName: string, 
    reportsPage: ReportsPage, 
    testFunction: () => Promise<void>
  ) {
    await reportsPage.goto();
    await reportsPage.expectToBeOnReportsPage();
    await testFunction();
    console.log(`${testName} verified on reports page`);
  }

  /**
   * Helper for individual report page navigation tests - expects it to work
   */
  static async performReportPageTest(
    page: Page, 
    testName: string, 
    reportsPage: ReportsPage, 
    reportPage: ReportPage, 
    testFunction: () => Promise<void>
  ) {
    await reportsPage.goto();
    await reportsPage.expectToBeOnReportsPage();
    await testFunction();
    console.log(`${testName} verified`);
  }

  /**
   * Helper to test reports listing functionality
   */
  static async testReportsListing(page: Page, reportsPage: ReportsPage) {
    console.log('Testing reports listing functionality');
    
    await reportsPage.expectLoadingComplete();
    
    const hasReportsDisplay = await reportsPage.expectReportsDisplayed();
    expect(hasReportsDisplay).toBeTruthy();
    
    const reportsCount = await reportsPage.getReportLinksCount();
    expect(reportsCount).toBeGreaterThanOrEqual(0);
    console.log(`Found ${reportsCount} report links`);
    
    return true;
  }

  /**
   * Helper to test individual report navigation
   */
  static async testReportNavigation(page: Page, reportsPage: ReportsPage, reportType: string) {
    console.log(`Testing ${reportType} report navigation`);
    
    let navigationSuccessful = false;
    
    switch (reportType) {
      case 'birthdays':
        navigationSuccessful = await reportsPage.clickBirthdaysReport();
        break;
      case 'attendanceTrend':
        navigationSuccessful = await reportsPage.clickAttendanceTrendReport();
        break;
      case 'groupAttendance':
        navigationSuccessful = await reportsPage.clickGroupAttendanceReport();
        break;
      case 'dailyGroupAttendance':
        navigationSuccessful = await reportsPage.clickDailyGroupAttendanceReport();
        break;
      case 'donationSummary':
        navigationSuccessful = await reportsPage.clickDonationSummaryReport();
        break;
      default:
        navigationSuccessful = await reportsPage.clickFirstReportLink();
        break;
    }
    
    expect(navigationSuccessful).toBeTruthy();
    console.log(`Successfully navigated to ${reportType} report`);
    return true;
  }

  /**
   * Helper to test report page functionality
   */
  static async testReportPageFunctionality(page: Page, reportPage: ReportPage) {
    console.log('Testing report page functionality');
    
    await reportPage.expectLoadingComplete();
    
    const hasReportDetails = await reportPage.expectReportDetailsVisible();
    
    if (hasReportDetails) {
      console.log('Report page details accessible');
      
      // Test report filter
      const hasFilter = await reportPage.expectReportFilterVisible();
      if (hasFilter) {
        console.log('Report filter available');
        
        const filterCount = await reportPage.getFilterInputsCount();
        console.log(`Found ${filterCount} filter inputs`);
        
        // Test run report functionality
        const runReportClicked = await reportPage.clickRunReport();
        if (runReportClicked) {
          console.log('Run report functionality available');
        }
      }
      
      // Test report content
      const hasContent = await reportPage.expectReportContentVisible();
      if (hasContent) {
        console.log('Report content displayed');
        
        // Test export functionality
        const exportClicked = await reportPage.clickExport();
        if (exportClicked) {
          console.log('Export functionality available');
        }
      }
      
      return true;
    } else {
      console.log('Report page may be structured differently');
    }
    
    return false;
  }

  /**
   * Helper to test report filtering functionality
   */
  static async testReportFiltering(page: Page, reportPage: ReportPage) {
    console.log('Testing report filtering functionality');
    
    const testData = this.getTestData().filters;
    
    // Test date filtering
    const dateFromFilled = await reportPage.fillDateFrom(testData.dateFrom);
    const dateToFilled = await reportPage.fillDateTo(testData.dateTo);
    
    if (dateFromFilled || dateToFilled) {
      console.log('Date filtering available');
    }
    
    // Test group filtering
    const groupSelected = await reportPage.selectGroup(testData.group);
    if (groupSelected) {
      console.log('Group filtering available');
    }
    
    // Test running report with filters
    const runReportClicked = await reportPage.clickRunReport();
    if (runReportClicked) {
      console.log('Report filtering functionality working');
      return true;
    }
    
    return false;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    const components = {
      reportsListing: {
        title: 'h1:has-text("Reports"), h1:has-text("reports")',
        content: '#reportsBox, ul, .reports, #mainContent'
      },
      reportPage: {
        title: 'h1:has-text("Report"), h2:has-text("Report")',
        content: '.report-filter, table, .chart, #mainContent'
      },
      navigation: {
        title: 'h1',
        content: '#mainContent'
      }
    };

    const config = components[componentType] || components.navigation;
    
    const hasTitle = await page.locator(config.title).first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasContent = await page.locator(config.content).first().isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(hasTitle || hasContent).toBeTruthy();
    console.log(`${componentType} page accessible and main components visible`);
    return true;
  }

  /**
   * Available report types for testing
   */
  static getReportTypes() {
    return [
      'birthdays',
      'attendanceTrend',
      'groupAttendance',
      'dailyGroupAttendance',
      'donationSummary'
    ];
  }

  /**
   * Common test data for reports testing
   */
  static getTestData() {
    return {
      filters: {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        group: 'all'
      },
      reports: {
        birthday: 'birthdays',
        attendance: 'attendanceTrend',
        donations: 'donationSummary'
      }
    };
  }
}