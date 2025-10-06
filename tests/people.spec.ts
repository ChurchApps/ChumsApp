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
    const searchBtn = page.locator('button').getByText('Search').first();
    await searchBtn.click();

    await page.waitForResponse(response => response.url().includes('/people') && response.status() === 200, { timeout: 10000 }).catch(() => { });

    await page.waitForSelector('table tbody tr', { state: 'visible' });
    const results = page.locator('table tbody tr');
    await expect(results.first()).toBeVisible();
  });

  test('should advance search for people', async ({ page }) => {
    //search
    const searchInput = page.locator('[id="display-box"] textarea').first();
    await searchInput.fill('Show me married men');
    const searchBtn = page.locator('button').getByText('Search').last();
    await searchBtn.click();

    await page.waitForResponse(response => response.url().includes('/people') && response.status() === 200, { timeout: 10000 }).catch(() => { });
    await page.waitForTimeout(5000);
    await page.waitForSelector('table tbody tr', { state: 'visible' });
    const results = page.locator('table tbody tr');
    await expect(results.first()).toBeVisible();
    //check result accuracy
    const firstPerson = page.locator('table tbody tr').first();
    await firstPerson.click();
    const checkGender = page.locator('p').getByText('Male');
    await checkGender.click();
    const checkMarriage = page.locator('p').getByText('Married');
    await checkMarriage.click();
  });

  test('should open notes tab', async ({ page }) => {
    await expect(page).toHaveURL(/\/people/);

    const firstPerson = page.locator('table tbody tr').first();
    await firstPerson.click();
    await page.waitForURL(/\/people\/PER\d+/, { timeout: 10000 });

    const notesBtn = page.locator('button').getByText('Notes');
    await notesBtn.click();
    const seekNotes = page.locator('[name="noteText"]');
    await seekNotes.click();
  });

  test('should open groups tab', async ({ page }) => {
    await expect(page).toHaveURL(/\/people/);

    const firstPerson = page.locator('table tbody tr').first();
    await firstPerson.click();
    await page.waitForURL(/\/people\/PER\d+/, { timeout: 10000 });

    const groupsBtn = page.locator('button').getByText('Groups');
    await groupsBtn.click();
    await page.waitForTimeout(5000);
    const seekText = page.locator('p').getByText('Not currently a member of any groups.');
    const seekGroup = page.locator('li').first();
    const seekEither = seekText.or(seekGroup);
    await seekEither.click();
  });

  test('should open attendance tab', async ({ page }) => {
    await expect(page).toHaveURL(/\/people/);

    const firstPerson = page.locator('table tbody tr').first();
    await firstPerson.click();
    await page.waitForURL(/\/people\/PER\d+/, { timeout: 10000 });

    const attBtn = page.locator('button').getByText('Attendance');
    await attBtn.click();
    await page.waitForTimeout(5000);
    const seekText = page.locator('p').getByText('No attendance records.');
    const seekDate = page.locator('li').first();
    const seekEither = seekText.or(seekDate);
    await seekEither.click();
  });

  test('should open donations tab', async ({ page }) => {
    await expect(page).toHaveURL(/\/people/);

    const firstPerson = page.locator('table tbody tr').first();
    await firstPerson.click();
    await page.waitForURL(/\/people\/PER\d+/, { timeout: 10000 });

    const donationBtn = page.locator('button').getByText('Donations');
    await donationBtn.click();
    await page.waitForTimeout(5000);
    const seekText = page.locator('td').getByText('Donations will appear once a donation has been entered.');
    const seekDate = page.locator('li').first();
    const seekEither = seekText.or(seekDate);
    await seekEither.click();
  });

  test('should let you add people', async ({ page }) => {
    //add person
    const firstInput = page.locator('[name="first"]');
    await firstInput.fill('Octavian');
    const lastInput = page.locator('[name="last"]');
    await lastInput.fill('Tester');
    const emailInput = page.locator('[name="email"]');
    await emailInput.fill('octaviantester@gmail.com');
    const addBtn = page.locator('[type="submit"]');
    await addBtn.click();

    //search for person
    const searchInput = page.locator('input[name="searchText"]');
    await searchInput.fill('Octavian');
    const searchBtn = page.locator('button').getByText('Search').first();
    await searchBtn.click();

    await page.waitForResponse(response => response.url().includes('/people') && response.status() === 200, { timeout: 10000 }).catch(() => { });

    await page.waitForSelector('table tbody tr', { state: 'visible' });
    const results = page.locator('table tbody tr');
    await expect(results.first()).toBeVisible();
    //click on person
    const firstPerson = page.locator('td').getByText('Octavian');
    await firstPerson.click();

    await page.waitForURL(/\/people\/PER\d+/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/people\/PER\d+/);
  });

});