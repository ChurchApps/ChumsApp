import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class PlanPage {
  readonly page: Page;
  readonly assignmentsTab: Locator;
  readonly serviceOrderTab: Locator;
  readonly positionsTable: Locator;
  readonly serviceOrderTable: Locator;
  readonly addPositionButton: Locator;
  readonly addServiceItemButton: Locator;
  readonly addSongButton: Locator;
  readonly autoAssignButton: Locator;
  readonly printButton: Locator;
  readonly positionRows: Locator;
  readonly serviceItemRows: Locator;
  readonly loadingIndicator: Locator;
  readonly sideNav: Locator;
  readonly mainContent: Locator;
  readonly planName: Locator;
  readonly serviceDate: Locator;
  readonly editPlanButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.assignmentsTab = page.locator('.sideNav a:has-text("Assignments"), [role="tab"]:has-text("Assignments")');
    this.serviceOrderTab = page.locator('.sideNav a:has-text("Service Order"), [role="tab"]:has-text("Service Order")');
    this.positionsTable = page.locator('table, [data-testid="positions-table"]');
    this.serviceOrderTable = page.locator('table, [data-testid="service-order-table"]');
    this.addPositionButton = page.locator('button:has-text("Add Position"), [data-testid="add-position"]');
    this.addServiceItemButton = page.locator('button:has-text("Add Item"), [data-testid="add-service-item"]');
    this.addSongButton = page.locator('button:has-text("Add Song"), [data-testid="add-song"]');
    this.autoAssignButton = page.locator('button:has-text("Auto Assign"), [data-testid="auto-assign"]');
    this.printButton = page.locator('button:has-text("Print"), [data-testid="print-plan"]');
    this.positionRows = page.locator('tbody tr, .position-row');
    this.serviceItemRows = page.locator('tbody tr, .service-item-row');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.sideNav = page.locator('.sideNav');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.planName = page.locator('h1, h2, .plan-name');
    this.serviceDate = page.locator('.service-date, .date');
    this.editPlanButton = page.locator('button:has-text("Edit Plan"), [data-testid="edit-plan"]');
  }

  async goto(planId: string) {
    await this.page.goto(`/plans/${planId}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectToBeOnPlanPage() {
    await TestHelpers.expectUrl(this.page, '/plans/\\w+');
  }

  async expectPlanDetailsVisible() {
    const hasMainContent = await this.mainContent.isVisible().catch(() => false);
    const hasPlanContent = await this.page.locator('h1, h2, text=Plan, text=plan').first().isVisible().catch(() => false);
    return hasMainContent || hasPlanContent;
  }

  async expectTabsVisible() {
    const hasAssignmentsTab = await this.assignmentsTab.isVisible().catch(() => false);
    const hasAnyTab = await this.page.locator('[role="tab"], button').filter({ hasText: /Assignments|Service Order/ }).first().isVisible().catch(() => false);
    return hasAssignmentsTab || hasAnyTab;
  }

  async clickAssignmentsTab() {
    const assignmentsTabExists = await this.assignmentsTab.isVisible().catch(() => false);
    if (assignmentsTabExists) {
      await this.assignmentsTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickServiceOrderTab() {
    const serviceOrderTabExists = await this.serviceOrderTab.isVisible().catch(() => false);
    if (serviceOrderTabExists) {
      await this.serviceOrderTab.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectPositionsTableVisible() {
    const hasTable = await this.positionsTable.isVisible().catch(() => false);
    const hasNoPositionsMessage = await this.page.locator('text=No positions found, text=No positions available').isVisible().catch(() => false);
    return hasTable || hasNoPositionsMessage;
  }

  async expectServiceOrderTableVisible() {
    const hasTable = await this.serviceOrderTable.isVisible().catch(() => false);
    const hasNoItemsMessage = await this.page.locator('text=No service items, text=No items found').isVisible().catch(() => false);
    return hasTable || hasNoItemsMessage;
  }

  async clickAddPosition() {
    const addButtonExists = await this.addPositionButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addPositionButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickAddServiceItem() {
    const addButtonExists = await this.addServiceItemButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addServiceItemButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickAddSong() {
    const addButtonExists = await this.addSongButton.isVisible().catch(() => false);
    if (addButtonExists) {
      await this.addSongButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickAutoAssign() {
    const autoAssignExists = await this.autoAssignButton.isVisible().catch(() => false);
    if (autoAssignExists) {
      await this.autoAssignButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickPrint() {
    const printButtonExists = await this.printButton.isVisible().catch(() => false);
    if (printButtonExists) {
      await this.printButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async getPositionsCount() {
    // First ensure we're on assignments tab
    await this.clickAssignmentsTab();
    const rows = await this.positionRows.count();
    return rows;
  }

  async getServiceItemsCount() {
    // First ensure we're on service order tab
    await this.clickServiceOrderTab();
    const rows = await this.serviceItemRows.count();
    return rows;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async editFirstPosition() {
    // Look for edit button in the first position row
    const editButton = this.page.locator('tbody tr:first-child button:has-text("Edit"), .position-row:first-child button:has-text("Edit")').first();
    const editButtonExists = await editButton.isVisible().catch(() => false);
    
    if (editButtonExists) {
      await editButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async assignFirstPosition() {
    // Look for assign button in the first position row
    const assignButton = this.page.locator('tbody tr:first-child button:has-text("Assign"), .position-row:first-child button:has-text("Assign")').first();
    const assignButtonExists = await assignButton.isVisible().catch(() => false);
    
    if (assignButtonExists) {
      await assignButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async editFirstServiceItem() {
    // Look for edit button in the first service item row
    const editButton = this.page.locator('tbody tr:first-child button:has-text("Edit"), .service-item-row:first-child button:has-text("Edit")').first();
    const editButtonExists = await editButton.isVisible().catch(() => false);
    
    if (editButtonExists) {
      await editButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async deleteFirstPosition() {
    // Look for delete button in the first position row
    const deleteButton = this.page.locator('tbody tr:first-child button:has-text("Delete"), .position-row:first-child button:has-text("Delete")').first();
    const deleteButtonExists = await deleteButton.isVisible().catch(() => false);
    
    if (deleteButtonExists) {
      await deleteButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async deleteFirstServiceItem() {
    // Look for delete button in the first service item row
    const deleteButton = this.page.locator('tbody tr:first-child button:has-text("Delete"), .service-item-row:first-child button:has-text("Delete")').first();
    const deleteButtonExists = await deleteButton.isVisible().catch(() => false);
    
    if (deleteButtonExists) {
      await deleteButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectEditPlanAvailable() {
    return await this.editPlanButton.isVisible().catch(() => false);
  }

  async clickEditPlan() {
    const editButtonExists = await this.editPlanButton.isVisible().catch(() => false);
    if (editButtonExists) {
      await this.editPlanButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }
}