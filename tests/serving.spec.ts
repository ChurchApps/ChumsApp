import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

// OCTAVIAN/OCTAVIUS are the names used for testing. If you see Octavian or Octavius entered anywhere, it is a result of these tests.
test.describe('Serving Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    const menuBtn = page.locator('[id="primaryNavButton"]').getByText('expand_more');
    await menuBtn.click();
    const servingHomeBtn = page.locator('[data-testid="nav-item-serving"]');
    await servingHomeBtn.click();
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL(/\/plans/);
  });

  /* test('should load serving page', async ({ page }) => {
    const servingHeader = page.locator('h4').getByText('Select a Ministry');
    await servingHeader.click();
  }); */

  test('should add ministry', async ({ page }) => {
    const addBtn = page.locator('button').getByText('Add Ministry');
    await addBtn.click();
    const minName = page.locator('[name="name"]');
    await minName.fill('Octavian Ministry');
    const saveBtn = page.locator('button').getByText('Add').nth(1);
    await saveBtn.click();
    const verifiedMin = page.locator('a').getByText('Octavian Ministry');
    await expect(verifiedMin).toHaveCount(1);
  });

  test('should cancel adding ministry', async ({ page }) => {
    const addBtn = page.locator('button').getByText('Add Ministry');
    await addBtn.click();
    const minName = page.locator('[name="name"]');
    await expect(minName).toHaveCount(1);
    const cancelBtn = page.locator('button').getByText('cancel');
    await cancelBtn.click();
    await expect(minName).toHaveCount(0);
  });

  test('should manage ministry', async ({ page }) => {
    const manageBtn = page.locator('a').getByText('Manage').nth(1);
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);
  });

  test('should add person to ministry', async ({ page }) => {
    const manageBtn = page.locator('a').getByText('Manage').nth(1);
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const personSearch = page.locator('[name="personAddText"]');
    await personSearch.fill('Dorothy');
    const searchBtn = page.locator('[data-testid="person-add-search-button"]');
    await searchBtn.click();
    const addBtn = page.locator('button').getByText('Add');
    await addBtn.click();
    const verifiedPerson = page.locator('[id="groupMembersBox"] a').getByText('Dorothy Jackson');
    await expect(verifiedPerson).toHaveCount(1);
  });

  test('should advanced add person to ministry', async ({ page }) => {
    const manageBtn = page.locator('a').getByText('Manage').nth(1);
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const advBtn = page.locator('button').getByText('Advanced');
    await advBtn.click();
    const firstCheck = page.locator('div input[type="checkbox"]').first();
    await firstCheck.click();
    const condition = page.locator('div[aria-haspopup="listbox"]');
    await condition.click();
    const equalsCondition = page.locator('li[data-value="equals"]');
    await equalsCondition.click();
    const firstName = page.locator('input[type="text"]');
    await firstName.fill('Grace');
    const searchBtn = page.locator('button').getByText('Search');
    await searchBtn.click();
    const addBtn = page.locator('button').getByText('Add');
    await addBtn.click();
    const verifiedPerson = page.locator('[id="groupMembersBox"] a').getByText('Grace Jackson');
    await expect(verifiedPerson).toHaveCount(1);
  });

  test('should remove person from ministry', async ({ page }) => {
    const manageBtn = page.locator('a').getByText('Manage').nth(1);
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const removeBtn = page.locator('button').getByText('person_remove').last();
    await removeBtn.click();
    const verifiedRemoved = page.locator('[id="groupMembersBox"] a').getByText('Grace Jackson');
    await expect(verifiedRemoved).toHaveCount(0);
  });

  test('should promote person to ministry leader', async ({ page }) => {
    const manageBtn = page.locator('a').getByText('Manage').nth(1);
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const promoteBtn = page.locator('button').getByText('key').first();
    await promoteBtn.click();
    await page.reload();
    const verifiedPromoted = page.locator('button').getByText('key_off');
    await expect(verifiedPromoted).toHaveCount(1);
  });

  test('should edit ministry', async ({ page }) => {
    const manageBtn = page.locator('a').getByText('Manage').nth(1);
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const editBtn = page.locator('[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"]');
    await editBtn.click();
    const minName = page.locator('[name="name"]');
    await minName.fill('Octavius Ministry');
    const saveBtn = page.locator('button').getByText('Save');
    await saveBtn.click();
    await page.waitForTimeout(500);
    const verifiedHeader = page.locator('p').getByText('Octavius Ministry');
    await expect(verifiedHeader).toHaveCount(1);
  });

  test('should cancel editing ministry', async ({ page }) => {
    const manageBtn = page.locator('a').getByText('Manage').nth(1);
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const editBtn = page.locator('[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"]');
    await editBtn.click();
    const minName = page.locator('[name="name"]');
    await expect(minName).toHaveCount(1);
    const cancelBtn = page.locator('button').getByText('Cancel');
    await cancelBtn.click();
    await page.waitForTimeout(500);
    await expect(minName).toHaveCount(0);
  });

  test('should create plan type', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);

    const addBtn = page.locator('button').getByText('Create Plan Type');
    /* const secondaryAddBtn = page.locator('button').getByText('Add Plan Type');
    const eitherAddBtn = addBtn.or(secondaryAddBtn); */
    await addBtn.click();
    const typeName = page.locator('[type="text"]');
    await typeName.fill('Octavian Type');
    const saveBtn = page.locator('button').getByText('Save');
    await saveBtn.click();
    await page.waitForTimeout(500);
    const verifiedType = page.locator('a').getByText('Octavian Type');
    await expect(verifiedType).toHaveCount(1);
  });

  test('should edit plan type', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);

    const editBtn = page.locator('[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"]');
    await editBtn.click();
    const typeName = page.locator('[type="text"]');
    await typeName.fill('Octavius Type');
    const saveBtn = page.locator('button').getByText('Save');
    await saveBtn.click();
    await page.waitForTimeout(500);
    const verifiedType = page.locator('a').getByText('Octavius Type');
    await expect(verifiedType).toHaveCount(1);
  });

  test('should cancel editing plan type', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);

    const editBtn = page.locator('[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"]');
    await editBtn.click();
    const typeName = page.locator('[type="text"]');
    await expect(typeName).toHaveCount(1);
    const cancelBtn = page.locator('button').getByText('cancel');
    await cancelBtn.click();
    await page.waitForTimeout(500);
    await expect(typeName).toHaveCount(0);
  });

  test('should add service plan', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const plansBtn = page.locator('button').getByText('Plans').last();
    await plansBtn.click();

    const addBtn = page.locator('[data-testid="add-plan-button"]');
    await addBtn.click();
    const planName = page.locator('[name="name"]');
    await planName.fill('Mar 10, 2025');
    const date = page.locator('[id="serviceDate"]');
    await date.fill('2025-03-01');
    const saveBtn = page.locator('button').getByText('Save');
    await saveBtn.click();
    await page.waitForTimeout(500);
    const verifiedPlan = page.locator('a').getByText('Mar 10, 2025');
    await expect(verifiedPlan).toHaveCount(1);
  });

  test('should edit service plan', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const plansBtn = page.locator('button').getByText('Plans').last();
    await plansBtn.click();

    const editBtn = page.locator('button').getByText('Edit');
    await editBtn.click();
    const planName = page.locator('[name="name"]');
    await planName.fill('Mar 1, 2025');
    const saveBtn = page.locator('button').getByText('Save');
    await saveBtn.click();
    await page.waitForTimeout(500);
    const verifiedPlan = page.locator('a').getByText('Mar 1, 2025');
    await expect(verifiedPlan).toHaveCount(1);
  });

  test('should cancel editing service plan', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const plansBtn = page.locator('button').getByText('Plans').last();
    await plansBtn.click();

    const editBtn = page.locator('button').getByText('Edit');
    await editBtn.click();
    const planName = page.locator('[name="name"]');
    await expect(planName).toHaveCount(1);
    const cancelBtn = page.locator('button').getByText('Cancel');
    await cancelBtn.click();
    await page.waitForTimeout(500);
    await expect(planName).toHaveCount(0);
  });

  test('should delete service plan', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const plansBtn = page.locator('button').getByText('Plans').last();
    await plansBtn.click();

    const editBtn = page.locator('button').getByText('Edit');
    await editBtn.click();
    const deleteBtn = page.locator('button').getByText('Delete');
    await deleteBtn.click();
    await page.waitForTimeout(500);
    const verifiedPlan = page.locator('a').getByText('Mar 1, 2025');
    await expect(verifiedPlan).toHaveCount(0);
  });

  test('should add team', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const teamsBtn = page.locator('button').getByText('Teams');
    await teamsBtn.click();

    const addBtn = page.locator('[data-testid="add-team-button"]');
    await addBtn.click();
    const teamName = page.locator('[name="name"]');
    await teamName.fill('Octavian Team');
    const saveBtn = page.locator('button').getByText('Add');
    await saveBtn.click();
    await page.waitForTimeout(500);
    const verifiedTeam = page.locator('a').getByText('Octavian Team');
    await expect(verifiedTeam).toHaveCount(1);
  });

  test('should add person to team', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const teamsBtn = page.locator('button').getByText('Teams');
    await teamsBtn.click();
    const manageBtn = page.locator('a').getByText('Octavian Team');
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const personSearch = page.locator('[name="personAddText"]');
    await personSearch.fill('Dorothy');
    const searchBtn = page.locator('[data-testid="person-add-search-button"]');
    await searchBtn.click();
    const addBtn = page.locator('button').getByText('Add');
    await addBtn.click();
    const verifiedPerson = page.locator('[id="groupMembersBox"] a').getByText('Dorothy Jackson');
    await expect(verifiedPerson).toHaveCount(1);
  });

  test('should advanced add person to team', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const teamsBtn = page.locator('button').getByText('Teams');
    await teamsBtn.click();
    const manageBtn = page.locator('a').getByText('Octavian Team');
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const advBtn = page.locator('button').getByText('Advanced');
    await advBtn.click();
    const firstCheck = page.locator('div input[type="checkbox"]').first();
    await firstCheck.click();
    const condition = page.locator('div[aria-haspopup="listbox"]');
    await condition.click();
    const equalsCondition = page.locator('li[data-value="equals"]');
    await equalsCondition.click();
    const firstName = page.locator('input[type="text"]');
    await firstName.fill('Grace');
    const searchBtn = page.locator('button').getByText('Search');
    await searchBtn.click();
    const addBtn = page.locator('button').getByText('Add');
    await addBtn.click();
    const verifiedPerson = page.locator('[id="groupMembersBox"] a').getByText('Grace Jackson');
    await expect(verifiedPerson).toHaveCount(1);
  });

  test('should remove person from team', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const teamsBtn = page.locator('button').getByText('Teams');
    await teamsBtn.click();
    const manageBtn = page.locator('a').getByText('Octavian Team');
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const removeBtn = page.locator('button').getByText('person_remove').last();
    await removeBtn.click();
    const verifiedRemoved = page.locator('[id="groupMembersBox"] a').getByText('Grace Jackson');
    await expect(verifiedRemoved).toHaveCount(0);
  });

  test('should promote person to team leader', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const teamsBtn = page.locator('button').getByText('Teams');
    await teamsBtn.click();
    const manageBtn = page.locator('a').getByText('Octavian Team');
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const promoteBtn = page.locator('button').getByText('key').first();
    await promoteBtn.click();
    await page.reload();
    const verifiedPromoted = page.locator('button').getByText('key_off');
    await expect(verifiedPromoted).toHaveCount(1);
  });

  test('should edit team', async ({ page }) => {
    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const teamsBtn = page.locator('button').getByText('Teams');
    await teamsBtn.click();
    const manageBtn = page.locator('a').getByText('Octavian Team');
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const editBtn = page.locator('[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"]');
    await editBtn.click();
    const teamName = page.locator('[name="name"]');
    await teamName.fill('Octavius Team');
    const saveBtn = page.locator('button').getByText('Save');
    await saveBtn.click();
    await page.waitForTimeout(500);
    const verifiedHeader = page.locator('p').getByText('Octavius Team');
    await expect(verifiedHeader).toHaveCount(1);
  });

  test('should delete team', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });

    const minBtn = page.locator('a').getByText('Octavius Ministry');
    await minBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/plans\/ministries\/[^/]+/);
    const teamsBtn = page.locator('button').getByText('Teams');
    await teamsBtn.click();
    const manageBtn = page.locator('a').getByText('Octavius Team');
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const editBtn = page.locator('[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"]');
    await editBtn.click();
    const deleteBtn = page.locator('button').getByText('Delete');
    await deleteBtn.click();
    await page.waitForTimeout(500);
    const verifiedRemoved = page.locator('table a').getByText('Octavius Team');
    await expect(verifiedRemoved).toHaveCount(0);
  });

  test('should delete ministry', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });

    const manageBtn = page.locator('a').getByText('Manage').nth(1);
    await manageBtn.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/groups\/[^/]+/);

    const editBtn = page.locator('[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"]');
    await editBtn.click();
    const deleteBtn = page.locator('button').getByText('Delete');
    await deleteBtn.click();
    await page.waitForTimeout(500);
    const verifiedRemoved = page.locator('table a').getByText('Octavius Ministry');
    await expect(verifiedRemoved).toHaveCount(0);
  });

});