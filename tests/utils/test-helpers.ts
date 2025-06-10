import { expect, Page, Locator } from '@playwright/test';

export class TestHelpers {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  static async waitForElement(page: Page, selector: string, timeout = 10000) {
    await page.waitForSelector(selector, { timeout });
  }

  static async fillAndWait(page: Page, locator: Locator, value: string) {
    await locator.fill(value);
    await page.waitForTimeout(100);
  }

  static async clickAndWait(page: Page, locator: Locator) {
    await locator.click();
    await page.waitForTimeout(500);
  }

  static async expectUrl(page: Page, expectedPath: string) {
    await expect(page).toHaveURL(new RegExp(expectedPath));
  }

  static async expectElementText(page: Page, locator: Locator, expectedText: string) {
    await expect(locator).toContainText(expectedText);
  }

  static async expectElementVisible(page: Page, locator: Locator) {
    await expect(locator).toBeVisible();
  }

  static async expectElementHidden(page: Page, locator: Locator) {
    await expect(locator).toBeHidden();
  }
}