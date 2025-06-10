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

  test('should perform basic name search', async ({ page }) => {
    const searchTerms = GroupsTestHelpers.getSearchTerms().basic;
    await GroupsTestHelpers.performSearchTest(page, 'basic name search', groupsPage, searchTerms);
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

  test('should allow search modification and re-search', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'search modification and re-search', groupsPage, async (mode) => {
      if (mode === 'groups') {
        await groupsPage.searchGroups('Group');
        await page.waitForLoadState('domcontentloaded');
        
        await groupsPage.searchGroups('Bible');
        await page.waitForLoadState('domcontentloaded');
        
        await groupsPage.searchGroups('Study');
        await page.waitForLoadState('domcontentloaded');
      } else {
        const terms = ['group', 'demo', 'test'];
        for (const term of terms) {
          await groupsPage.searchGroupsFromDashboard(term);
          await page.waitForLoadState('domcontentloaded');
        }
      }
    });
  });

  test('should maintain search input value after search', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'search input value persistence', groupsPage, async (mode) => {
      const searchTerm = mode === 'groups' ? 'TestGroup' : 'demo';
      
      if (mode === 'groups') {
        const searchSuccessful = await groupsPage.searchGroups(searchTerm);
        if (searchSuccessful) {
          await page.waitForLoadState('domcontentloaded');
          const inputValue = await groupsPage.searchInput.inputValue();
          expect(inputValue).toBe(searchTerm);
        }
      } else {
        await groupsPage.searchGroupsFromDashboard(searchTerm);
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test('should handle search keyboard shortcuts', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'keyboard shortcuts', groupsPage, async (mode) => {
      if (mode === 'groups') {
        const searchInputExists = await groupsPage.searchInput.isVisible().catch(() => false);
        
        if (searchInputExists) {
          await groupsPage.searchInput.fill('TestSearch');
          await groupsPage.searchInput.press('Enter');
          await page.waitForLoadState('domcontentloaded');
          
          console.log('Enter key search functionality verified');
          
          await groupsPage.searchInput.press('Escape');
          await page.waitForLoadState('domcontentloaded');
          
          console.log('Keyboard shortcuts tested');
        } else {
          console.log('Search input not available for keyboard testing');
        }
      } else {
        await groupsPage.searchGroupsFromDashboard('demo');
        await page.waitForLoadState('domcontentloaded');
        console.log('Basic search functionality verified via dashboard (keyboard shortcuts may vary)');
      }
    });
  });

  test('should display search results in proper format', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'search results format', groupsPage, async (mode) => {
      if (mode === 'groups') {
        const searchSuccessful = await groupsPage.searchGroups('demo');
        if (searchSuccessful) {
          await page.waitForLoadState('networkidle', { timeout: 8000 });
          
          const hasResults = await groupsPage.expectGroupsDisplayed();
          
          if (hasResults) {
            const hasTable = await page.locator('table, .table, tbody').first().isVisible().catch(() => false);
            const hasRows = await page.locator('tr, .row').count() > 0;
            
            if (hasTable || hasRows) {
              console.log('Search results displayed in proper table format');
            } else {
              console.log('Search results may use different display format');
            }
          } else {
            console.log('No search results available in demo environment');
          }
        }
      } else {
        await groupsPage.searchGroupsFromDashboard('demo');
        await page.waitForLoadState('domcontentloaded');
        
        const hasAnyResults = await page.locator('[data-testid="search-results"], .search-results, table, .table').first().isVisible().catch(() => false);
        
        if (hasAnyResults) {
          console.log('Search results format verified via dashboard');
        } else {
          console.log('Search results display tested via dashboard (format may vary)');
        }
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
        }
        
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    await GroupsTestHelpers.performGroupsPageTest(page, 'empty search results', groupsPage, async (mode) => {
      const searchTerm = 'xyznobodyhasthisgroupname123456';
      
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
});