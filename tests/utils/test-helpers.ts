import { expect, Page, Locator } from '@playwright/test';

export class TestHelpers {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');
  }

  static async waitForElement(page: Page, selector: string, timeout = 15000) {
    await page.waitForSelector(selector, { timeout });
  }

  static async fillAndWait(page: Page, locator: Locator, value: string) {
    await locator.fill(value);
    await locator.blur();
  }

  static async clickAndWait(page: Page, locator: Locator) {
    await locator.click();
    await this.waitForPageLoad(page);
  }

  static async waitForChurchSelection(page: Page, timeout = 15000) {
    try {
      // Wait a bit for the page to settle after login
      await page.waitForLoadState('networkidle');
      
      const churchDialog = page.locator('text=Select a Church');
      const isChurchDialogVisible = await churchDialog.isVisible().catch(() => false);
      
      if (isChurchDialogVisible) {
        const graceChurch = page.locator('text=Grace Community Church').first();
        await graceChurch.click();
        
        // Wait for the dialog to close and ensure we're on dashboard
        await page.locator('h1:has-text("Chums")').waitFor({ timeout });
      }
    } catch (error) {
      // Church selection dialog may not appear or Grace Community Church may not be available
      // Continue anyway as this is expected in some test environments
    }
  }

  static async waitForApiResponse(page: Page, urlPattern: string | RegExp, timeout = 10000) {
    return page.waitForResponse(response => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    }, { timeout });
  }

  static async expectUrl(page: Page, expectedPath: string) {
    await expect(page).toHaveURL(new RegExp(expectedPath), { timeout: 15000 });
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