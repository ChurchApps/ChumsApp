import { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'demo@chums.org');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');

  await page.waitForSelector('text=Select a Church', { timeout: 10000 });

  const graceChurch = page.locator('[role="dialog"] h3:has-text("Grace Community Church")').first();
  await graceChurch.click({ timeout: 10000 });

  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
  await page.waitForSelector('#primaryNavButton', { state: 'visible' });
}