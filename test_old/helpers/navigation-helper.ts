import { Page } from '@playwright/test';

export class NavigationHelper {
  /**
   * Navigate to a specific section using data-testid attributes
   */
  static async navigateToSection(page: Page, section: string) {
    const testIdMap: Record<string, string> = {
      'dashboard': 'nav-item-dashboard',
      'people': 'nav-item-people',
      'groups': 'nav-item-groups',
      'donations': 'nav-item-donations',
      'plans': 'nav-item-plans',
      'tasks': 'nav-item-tasks',
      'settings': 'nav-item-settings',
      'attendance': 'nav-item-attendance',
      'forms': 'nav-item-forms',
      'admin': 'nav-item-admin',
      'batches': 'nav-item-batches',
      'funds': 'nav-item-funds',
      'songs': 'nav-item-songs',
      'profile': 'nav-item-profile',
      'devices': 'nav-item-devices'
    };

    const testId = testIdMap[section.toLowerCase()];
    if (!testId) {
      throw new Error(`Unknown section: ${section}`);
    }

    // Wait a bit for navigation to be ready (data-testid attributes are added after render)
    await page.waitForTimeout(1000);

    // Try to find the navigation item with data-testid
    const navItem = page.locator(`[data-testid="${testId}"]`).first();
    const hasTestId = await navItem.isVisible().catch(() => false);

    if (hasTestId) {
      console.log(`✓ Found ${section} navigation with data-testid`);
      await navItem.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      console.log(`✓ Navigated to ${section} page`);
      return true;
    }

    // Fallback: try to find by text content
    console.log(`⚠ Could not find ${section} navigation with data-testid, trying text-based search`);
    const textNavItem = page.locator(`text=${section}`).first();
    const hasText = await textNavItem.isVisible().catch(() => false);

    if (hasText) {
      console.log(`✓ Found ${section} navigation by text`);
      await textNavItem.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      console.log(`✓ Navigated to ${section} page`);
      return true;
    }

    console.log(`✗ Could not navigate to ${section} - item not found`);
    return false;
  }

  /**
   * Get the current section based on URL
   */
  static getCurrentSection(page: Page): string {
    const url = page.url();
    
    if (url.includes('/people')) return 'people';
    if (url.includes('/groups')) return 'groups';
    if (url.includes('/donations/funds')) return 'funds';
    if (url.includes('/donations/batches')) return 'batches';
    if (url.includes('/donations')) return 'donations';
    if (url.includes('/plans/songs')) return 'songs';
    if (url.includes('/plans')) return 'plans';
    if (url.includes('/tasks')) return 'tasks';
    if (url.includes('/settings')) return 'settings';
    if (url.includes('/attendance')) return 'attendance';
    if (url.includes('/forms')) return 'forms';
    if (url.includes('/admin')) return 'admin';
    if (url.includes('/profile/devices')) return 'devices';
    if (url.includes('/profile')) return 'profile';
    
    return 'dashboard';
  }

  /**
   * Wait for navigation to be ready (data-testid attributes to be added)
   */
  static async waitForNavigation(page: Page) {
    await page.waitForTimeout(1500);
    
    // Check if at least one navigation item with data-testid is visible
    const anyNavItem = page.locator('[data-testid^="nav-item-"]').first();
    try {
      await anyNavItem.waitFor({ state: 'visible', timeout: 5000 });
      console.log('✓ Navigation is ready');
    } catch {
      console.log('⚠ Navigation data-testid attributes may not be ready');
    }
  }

  /**
   * Check if a navigation item is visible
   */
  static async isNavigationItemVisible(page: Page, section: string): Promise<boolean> {
    const testIdMap: Record<string, string> = {
      'dashboard': 'nav-item-dashboard',
      'people': 'nav-item-people',
      'groups': 'nav-item-groups',
      'donations': 'nav-item-donations',
      'plans': 'nav-item-plans',
      'tasks': 'nav-item-tasks',
      'settings': 'nav-item-settings',
      'attendance': 'nav-item-attendance',
      'forms': 'nav-item-forms',
      'admin': 'nav-item-admin',
      'batches': 'nav-item-batches',
      'funds': 'nav-item-funds',
      'songs': 'nav-item-songs',
      'profile': 'nav-item-profile',
      'devices': 'nav-item-devices'
    };

    const testId = testIdMap[section.toLowerCase()];
    if (!testId) return false;

    const navItem = page.locator(`[data-testid="${testId}"]`).first();
    return await navItem.isVisible().catch(() => false);
  }
}