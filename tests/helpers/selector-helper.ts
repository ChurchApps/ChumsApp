import { Page, Locator } from '@playwright/test';

/**
 * Helper class for creating robust selectors that prefer data-testids
 * but fall back to other selectors for compatibility
 */
export class SelectorHelper {
  /**
   * Create a search input locator with data-testid preference
   */
  static searchInput(page: Page): Locator {
    return page.locator(['[data-testid="people-search-input"] input', '[data-testid="dashboard-people-search-input"] input', '#searchText', 'input[placeholder*="Search"]', 'input[name="search"]'].join(', '));
  }

  /**
   * Create a search button locator with data-testid preference
   */
  static searchButton(page: Page): Locator {
    return page.locator(['[data-testid="people-search-button"]', '[data-testid="dashboard-search-button"]', '[data-testid="search-button"]', 'button[type="submit"]', 'button:has-text("Search")'].join(', '));
  }

  /**
   * Create form input locator by field type with data-testid preference
   */
  static formInput(page: Page, fieldType: 'first-name' | 'last-name' | 'email' | 'phone'): Locator {
    const selectors = {
      'first-name': ['[data-testid="first-name-input"]', 'input[name="firstName"]', 'input[placeholder*="First"]'],
      'last-name': ['[data-testid="last-name-input"]', 'input[name="lastName"]', 'input[placeholder*="Last"]'],
      'email': ['[data-testid="email-input"]', 'input[name="email"]', 'input[type="email"]', 'input[placeholder*="Email"]'],
      'phone': ['[data-testid="phone-input"]', 'input[name="phone"]', 'input[type="tel"]', 'input[placeholder*="Phone"]']
    };

    return page.locator(selectors[fieldType].join(', '));
  }

  /**
   * Create add button locator with data-testid preference
   */
  static addButton(page: Page, itemType: string): Locator {
    return page.locator([
      `[data-testid="add-${itemType}-button"]`,
      `button:has-text("Add ${itemType}")`,
      `button:has-text("Create ${itemType}")`,
      `button:has-text("New ${itemType}")`,
      '.add-button',
      '[aria-label*="Add"]'
    ].join(', '));
  }

  /**
   * Create edit button locator with data-testid preference
   */
  static editButton(page: Page): Locator {
    return page.locator(['[data-testid="edit-button"]', 'button:has-text("Edit")', '[aria-label*="Edit"]', '.edit-button'].join(', '));
  }

  /**
   * Create save button locator with data-testid preference
   */
  static saveButton(page: Page): Locator {
    return page.locator(['[data-testid="save-button"]', 'button:has-text("Save")', 'button[type="submit"]', '[aria-label*="Save"]', '.save-button'].join(', '));
  }

  /**
   * Create delete button locator with data-testid preference
   */
  static deleteButton(page: Page): Locator {
    return page.locator(['[data-testid="delete-button"]', 'button:has-text("Delete")', '[aria-label*="Delete"]', '.delete-button'].join(', '));
  }

  /**
   * Create a robust locator for any element by trying multiple strategies
   */
  static createRobustLocator(page: Page, selectors: string[]): Locator {
    return page.locator(selectors.join(', '));
  }

  /**
   * Wait for any of the given locators to be visible
   */
  static async waitForAnyVisible(page: Page, locators: Locator[], timeout = 5000): Promise<Locator | null> {
    const promises = locators.map(async (locator, index) => {
      try {
        await locator.waitFor({ state: 'visible', timeout });
        return { locator, index };
      } catch {
        return null;
      }
    });

    const results = await Promise.allSettled(promises);
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        return result.value.locator;
      }
    }

    return null;
  }

  /**
   * Try to click the first available element from a list of selectors
   */
  static async clickFirstAvailable(page: Page, selectors: string[]): Promise<boolean> {
    for (const selector of selectors) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          await element.click();
          return true;
        }
      } catch {
        // Continue to next selector
      }
    }
    return false;
  }

  /**
   * Fill the first available input from a list of selectors
   */
  static async fillFirstAvailable(page: Page, selectors: string[], value: string): Promise<boolean> {
    for (const selector of selectors) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          await element.fill(value);
          return true;
        }
      } catch {
        // Continue to next selector
      }
    }
    return false;
  }
}