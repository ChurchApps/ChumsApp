import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
import { navigateToPeople } from './helpers/navigation';

test.describe('People Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToPeople(page);
  });

  test('should view person details', async ({ page }) => {
    await expect(page).toHaveURL(/\/people/);

    const firstPerson = page.locator('table tbody tr').first();
    await firstPerson.click();

    await page.waitForURL(/\/people\/PER\d+/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/people\/PER\d+/);
  });

  test('should search for people', async ({ page }) => {
    const searchInput = page.locator('input[name="searchText"]');
    await searchInput.fill('Smith');

    await page.waitForResponse(response => response.url().includes('/people') && response.status() === 200, { timeout: 10000 } ).catch(() => {});

    await page.waitForSelector('table tbody tr', { state: 'visible' });
    const results = page.locator('table tbody tr');
    await expect(results.first()).toBeVisible();
  });
});