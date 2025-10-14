import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Attendance Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    const menuBtn = page.locator('[id="primaryNavButton"]').getByText('expand_more');
    await menuBtn.click();
    const peopleHomeBtn = page.locator('[data-testid="nav-item-people"]');
    await peopleHomeBtn.click();
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL(/\/people/);
    const attHomeBtn = page.locator('[id="secondaryMenu"]').getByText('Attendance');
    await attHomeBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/attendance/);
  });

  test('should load attendance page', async ({ page }) => {
    const attendanceHeader = page.locator('h4').getByText('Attendance');
    await attendanceHeader.click();
  });

});