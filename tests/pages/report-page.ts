import { type Locator, type Page } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class ReportPage {
  readonly page: Page;
  readonly reportTitle: Locator;
  readonly reportFilter: Locator;
  readonly runReportButton: Locator;
  readonly exportButton: Locator;
  readonly reportTable: Locator;
  readonly reportChart: Locator;
  readonly filterInputs: Locator;
  readonly dateFromInput: Locator;
  readonly dateToInput: Locator;
  readonly groupSelect: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessages: Locator;
  readonly noDataMessage: Locator;
  readonly mainContent: Locator;
  readonly backToReportsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reportTitle = page.locator('h1, h2, .report-title');
    this.reportFilter = page.locator('.report-filter, [data-testid="report-filter"]');
    this.runReportButton = page.locator('button:has-text("Run Report"), button:has-text("Generate"), [data-testid="run-report"]');
    this.exportButton = page.locator('button:has-text("Export"), [data-testid="export-report"]');
    this.reportTable = page.locator('table, .report-table, [data-testid="report-table"]');
    this.reportChart = page.locator('.chart, canvas, .report-chart');
    this.filterInputs = page.locator('input, select, .filter-input');
    this.dateFromInput = page.locator('input[name*="from"], input[name*="start"], #dateFrom');
    this.dateToInput = page.locator('input[name*="to"], input[name*="end"], #dateTo');
    this.groupSelect = page.locator('select[name*="group"], #groupSelect');
    this.loadingIndicator = page.locator('.loading, text=Loading');
    this.errorMessages = page.locator('.error-message, .alert-danger, text=Error');
    this.noDataMessage = page.locator('text=No data, text=No results, text=Empty');
    this.mainContent = page.locator('main, .main-content, [role="main"]');
    this.backToReportsLink = page.locator('a:has-text("Reports"), [data-testid="back-to-reports"]');
  }

  async goto(reportKey: string) {
    await this.page.goto(`/reports/${reportKey}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectToBeOnReportPage() {
    await TestHelpers.expectUrl(this.page, '/reports/\\w+');
  }

  async expectReportDetailsVisible() {
    const hasMainContent = await this.mainContent.isVisible().catch(() => false);
    const hasReportContent = await this.page.locator('h1, h2, text=Report, text=report').first().isVisible().catch(() => false);
    return hasMainContent || hasReportContent;
  }

  async expectReportFilterVisible() {
    const hasFilter = await this.reportFilter.isVisible().catch(() => false);
    const hasFilterInputs = await this.filterInputs.first().isVisible().catch(() => false);
    return hasFilter || hasFilterInputs;
  }

  async expectReportContentVisible() {
    const hasTable = await this.reportTable.isVisible().catch(() => false);
    const hasChart = await this.reportChart.isVisible().catch(() => false);
    const hasNoData = await this.noDataMessage.isVisible().catch(() => false);
    return hasTable || hasChart || hasNoData;
  }

  async fillDateFrom(date: string) {
    const dateFromExists = await this.dateFromInput.isVisible().catch(() => false);
    if (dateFromExists) {
      await this.dateFromInput.fill(date);
      return true;
    }
    return false;
  }

  async fillDateTo(date: string) {
    const dateToExists = await this.dateToInput.isVisible().catch(() => false);
    if (dateToExists) {
      await this.dateToInput.fill(date);
      return true;
    }
    return false;
  }

  async selectGroup(groupValue: string) {
    const groupSelectExists = await this.groupSelect.isVisible().catch(() => false);
    if (groupSelectExists) {
      await this.groupSelect.selectOption(groupValue);
      return true;
    }
    return false;
  }

  async clickRunReport() {
    const runButtonExists = await this.runReportButton.isVisible().catch(() => false);
    if (runButtonExists) {
      await this.runReportButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickExport() {
    const exportButtonExists = await this.exportButton.isVisible().catch(() => false);
    if (exportButtonExists) {
      await this.exportButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async clickBackToReports() {
    const backLinkExists = await this.backToReportsLink.isVisible().catch(() => false);
    if (backLinkExists) {
      await this.backToReportsLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      return true;
    }
    return false;
  }

  async expectLoadingComplete() {
    const loadingExists = await this.loadingIndicator.isVisible().catch(() => false);
    if (loadingExists) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
    await this.page.waitForLoadState('networkidle');
  }

  async expectErrorMessages() {
    return await this.errorMessages.isVisible().catch(() => false);
  }

  async getReportTitleText() {
    const titleExists = await this.reportTitle.isVisible().catch(() => false);
    if (titleExists) {
      return await this.reportTitle.textContent();
    }
    return '';
  }

  async getFilterInputsCount() {
    const count = await this.filterInputs.count();
    return count;
  }
}