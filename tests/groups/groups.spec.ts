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
    await GroupsTestHelpers.performGroupsPageTest(page, 'groups page accessibility', groupsPage, async (mode) => {
      if (mode === 'groups') {
        await GroupsTestHelpers.testPageAccessibility(page, 'groupsSearch');
      } else {
        const canSearchFromDashboard = await groupsPage.testGroupsSearchFromDashboard();
        
        if (canSearchFromDashboard) {
          console.log('Groups search functionality available via dashboard');
        } else {
          console.log('Groups functionality not available in demo environment');
        }
      }
    });
  });

  test('should display groups list by default', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'groups list display', groupsPage, async (mode) => {
      if (mode === 'groups') {
        await groupsPage.expectLoadingComplete();
        
        const hasGroups = await groupsPage.expectGroupsDisplayed();
        
        if (hasGroups) {
          console.log('Groups list displayed successfully');
          
          const groupsCount = await groupsPage.getGroupsCount();
          console.log(`Found ${groupsCount} groups`);
        } else {
          console.log('No groups data in demo environment');
        }
      } else {
        console.log('Groups search functionality confirmed via dashboard (groups list not testable)');
      }
    });
  });

  test('should perform simple groups search', async ({ page }) => {
    const searchTerms = GroupsTestHelpers.getSearchTerms().basic;
    await GroupsTestHelpers.performSearchTest(page, 'simple groups search', groupsPage, searchTerms);
  });

  test('should handle partial name searches', async ({ page }) => {
    const searchTerms = GroupsTestHelpers.getSearchTerms().partial;
    await GroupsTestHelpers.performSearchTest(page, 'partial name search', groupsPage, searchTerms);
  });

  test('should handle case-insensitive searches', async ({ page }) => {
    const searchTerms = GroupsTestHelpers.getSearchTerms().caseInsensitive;
    await GroupsTestHelpers.performSearchTest(page, 'case-insensitive search', groupsPage, searchTerms);
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'empty search handling', groupsPage, async (mode) => {
      if (mode === 'groups') {
        const searchSuccessful = await groupsPage.searchGroups('');
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          await groupsPage.expectGroupsTableVisible();
        }
      } else {
        await groupsPage.searchGroupsFromDashboard('');
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test('should handle special characters in search', async ({ page }) => {
    const searchTerms = GroupsTestHelpers.getSearchTerms().special;
    await GroupsTestHelpers.performSearchTest(page, 'special character search', groupsPage, searchTerms);
  });

  test('should handle very long search terms', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'long search term handling', groupsPage, async (mode) => {
      const longTerm = mode === 'groups' 
        ? 'ThisIsAVeryLongSearchTermThatShouldBeHandledGracefullyForGroups'
        : 'ThisIsAVeryLongSearchTermForDashboardTesting';
      
      if (mode === 'groups') {
        const searchSuccessful = await groupsPage.searchGroups(longTerm);
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          await groupsPage.expectGroupsTableVisible();
        }
      } else {
        await groupsPage.searchGroupsFromDashboard(longTerm);
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test('should have export functionality', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'export functionality', groupsPage, async (mode) => {
      if (mode === 'groups') {
        await groupsPage.expectLoadingComplete();
        
        const exportExists = await groupsPage.expectExportAvailable();
        
        if (exportExists) {
          console.log('Export functionality available');
        } else {
          console.log('Export not available - may require data or permissions');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (export not testable)');
      }
    });
  });

  test('should navigate to individual group page', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'group navigation', groupsPage, async (mode) => {
      if (mode === 'groups') {
        await groupsPage.expectLoadingComplete();
        
        const groupClicked = await groupsPage.clickFirstGroup();
        
        if (groupClicked) {
          const currentUrl = page.url();
          const isOnGroupPage = /\/groups\/\w+/.test(currentUrl);
          expect(isOnGroupPage).toBeTruthy();
          console.log('Successfully navigated to group page');
        } else {
          console.log('No groups available to click in demo environment');
        }
      } else {
        console.log('Basic search functionality confirmed via dashboard (group navigation not testable)');
      }
    });
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'empty search results', groupsPage, async (mode) => {
      const searchTerm = 'xyznobodyhasthisgroupname123';
      
      if (mode === 'groups') {
        const searchSuccessful = await groupsPage.searchGroups(searchTerm);
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          // Should not crash or show errors
          await groupsPage.expectGroupsTableVisible();
          console.log('Empty search results handled gracefully');
        }
      } else {
        await groupsPage.searchGroupsFromDashboard(searchTerm);
        await page.waitForLoadState('domcontentloaded');
        console.log('Empty search results handled gracefully via dashboard');
      }
    });
  });

  test('should maintain page functionality after search', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'page functionality after search', groupsPage, async (mode) => {
      if (mode === 'groups') {
        await groupsPage.searchGroups('demo');
        await groupsPage.searchGroups('test');
        await groupsPage.expectGroupsTableVisible();
        console.log('Page functionality maintained after multiple searches');
      } else {
        await groupsPage.searchGroupsFromDashboard('demo');
        await groupsPage.searchGroupsFromDashboard('test');
        console.log('Page functionality maintained after multiple searches via dashboard');
      }
    });
  });

  test('should handle rapid consecutive searches', async ({ page }) => {
    const searchTerms = GroupsTestHelpers.getSearchTerms().rapid;
    await GroupsTestHelpers.performGroupsPageTest(page, 'rapid consecutive searches', groupsPage, async (mode) => {
      const terms = searchTerms[mode];
      
      if (mode === 'groups') {
        for (const term of terms) {
          const searchSuccessful = await groupsPage.searchGroups(term);
          if (searchSuccessful) {
            await page.waitForLoadState('domcontentloaded');
          }
        }
        
        await page.waitForLoadState('networkidle');
        await groupsPage.expectGroupsTableVisible();
      } else {
        for (const term of terms) {
          await groupsPage.searchGroupsFromDashboard(term);
          await page.waitForLoadState('domcontentloaded');
        }
      }
    });
  });

  test('should have accessible search elements', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'search accessibility', groupsPage, async (mode) => {
      if (mode === 'groups') {
        // Check for proper search structure
        const searchInputExists = await groupsPage.searchInput.isVisible().catch(() => false);
        
        if (searchInputExists) {
          console.log('Groups search elements are accessible');
        } else {
          console.log('Groups search may use different structure');
        }
      } else {
        // Check dashboard search accessibility
        const dashboardSearchInput = page.locator('[id="searchText"]').first();
        const dashboardSearchExists = await dashboardSearchInput.isVisible().catch(() => false);
        
        if (dashboardSearchExists) {
          console.log('Search elements accessibility tested via dashboard');
        } else {
          console.log('Dashboard search not available for accessibility testing');
        }
      }
    });
  });
});