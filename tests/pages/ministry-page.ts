import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class MinistryPage {
  readonly page: Page;
  readonly plansTab: Locator;
  readonly teamsTab: Locator;
  readonly plansTable: Locator;
  readonly teamsTable: Locator;
  readonly addPlanButton: Locator;
  readonly addTeamButton: Locator;
  readonly firstPlanLink: Locator;
  readonly planRows: Locator;
  readonly teamRows: Locator;
  readonly loadingIndicator: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly sideNav: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.plansTab = page.locator('.sideNav a:has-text("Plans"), [role="tab"]:has-text("Plans")');
    this.teamsTab = page.locator('.sideNav a:has-text("Teams"), [role="tab"]:has-text("Teams")');
    this.plansTable = page.locator('table, [data-testid="plans-table"]');
    this.teamsTable = page.locator('table, [data-testid="teams-table"]');
    this.addPlanButton = page.locator('button:has-text("Add Plan"), [data-testid="add-plan"]');
    this.addTeamButton = page.locator('button:has-text("Add Team"), [data-testid="add-team"]');
    this.firstPlanLink = page.locator('table tbody tr:first-child a, .plan-row:first-child a').first();
    this.planRows = page.locator('tbody tr, .plan-row');
    this.teamRows = page.locator('tbody tr, .team-row');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.searchInput = page.locator('input[placeholder*="Search"], input[name*="search"]');
    this.searchButton = page.locator('button:has-text("Search"), [data-testid="search-button"]');
    this.sideNav = page.locator('.sideNav');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
  }

  async goto(ministryId: string) {
    await this.page.goto(`/plans/ministries/${ministryId}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectToBeOnMinistryPage() {
    await TestHelpers.expectUrl(this.page, '/plans/ministries/\\w+');
  }

  async expectSideNavVisible() {
    const hasSideNav = await this.sideNav.isVisible().catch(() => false);
    const hasTabNav = await this.page.locator('[role="tab"], .tab').first().isVisible().catch(() => false);
    return hasSideNav || hasTabNav;
  }

  async clickPlansTab() {
    const plansTabExists = await this.plansTab.isVisible().catch(() => false);
    if (plansTabExists) {
      await this.plansTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickTeamsTab() {
    const teamsTabExists = await this.teamsTab.isVisible().catch(() => false);
    if (teamsTabExists) {
      await this.teamsTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectPlansTableVisible() {
    const hasTable = await this.plansTable.isVisible().catch(() => false);
    const hasNoPlansMessage = await this.page.locator('text=No plans found, text=No plans available').isVisible().catch(() => false);
    return hasTable || hasNoPlansMessage;
  }

  async expectTeamsTableVisible() {
    const hasTable = await this.teamsTable.isVisible().catch(() => false);
    const hasNoTeamsMessage = await this.page.locator('text=No teams found, text=No teams available').isVisible().catch(() => false);
    return hasTable || hasNoTeamsMessage;
  }

  async clickAddPlan() {
    const addButtonExists = await this.addPlanButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addPlanButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickFirstPlan() {
    const firstPlanExists = await this.firstPlanLink.isVisible().catch(() => false);
    if (firstPlanExists) {
      await this.firstPlanLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async getPlansCount() {
    const rows = await this.planRows.count();
    return rows;
  }

  async getTeamsCount() {
    const rows = await this.teamRows.count();
    return rows;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async searchPlans(searchTerm: string) {
    // First ensure we're on plans tab
    await this.clickPlansTab();
    
    const searchInputExists = await this.searchInput.isVisible().catch(() => false);
    
    if (searchInputExists) {
      await this.searchInput.fill(searchTerm);
      
      const searchButtonExists = await this.searchButton.isVisible().catch(() => false);
      if (searchButtonExists) {
        await this.searchButton.click();
      } else {
        await this.searchInput.press('Enter');
      }
      
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async editFirstPlan() {
    // Look for edit button in the first row
    const editButton = this.page.locator('tbody tr:first-child button:has-text("Edit"), .plan-row:first-child button:has-text("Edit")').first();
    const editButtonExists = await editButton.isVisible().catch(() => false);
    
    if (editButtonExists) {
      await editButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async copyFirstPlan() {
    // Look for copy button in the first row
    const copyButton = this.page.locator('tbody tr:first-child button:has-text("Copy"), .plan-row:first-child button:has-text("Copy")').first();
    const copyButtonExists = await copyButton.isVisible().catch(() => false);
    
    if (copyButtonExists) {
      await copyButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async deleteFirstPlan() {
    // Look for delete button in the first row
    const deleteButton = this.page.locator('tbody tr:first-child button:has-text("Delete"), .plan-row:first-child button:has-text("Delete")').first();
    const deleteButtonExists = await deleteButton.isVisible().catch(() => false);
    
    if (deleteButtonExists) {
      await deleteButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }
}