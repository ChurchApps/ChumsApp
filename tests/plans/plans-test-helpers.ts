import { Page, expect } from '@playwright/test';
import { PlansPage } from '../pages/plans-page';
import { MinistryPage } from '../pages/ministry-page';
import { PlanPage } from '../pages/plan-page';

export class PlansTestHelpers {
  
  /**
   * Main helper for testing plans page functionality
   */
  static async performPlansPageTest(
    page: Page, 
    testName: string, 
    plansPage: PlansPage, 
    testFunction: () => Promise<void>
  ) {
    await plansPage.goto();
    await plansPage.expectToBeOnPlansPage();
    await testFunction();
    console.log(`${testName} verified on plans page`);
  }

  /**
   * Helper for testing ministries display functionality
   */
  static async testMinistriesDisplay(page: Page, plansPage: PlansPage) {
    console.log('Testing ministries display functionality');
    await plansPage.expectLoadingComplete();
    const hasDisplay = await plansPage.expectMinistriesDisplayed();
    expect(hasDisplay).toBeTruthy();
    const count = await plansPage.getMinistriesCount();
    console.log(`Found ${count} ministries`);
    return true;
  }

  /**
   * Helper for testing ministry search functionality
   */
  static async testMinistrySearch(page: Page, plansPage: PlansPage, searchTerm: string) {
    console.log(`Testing ministry search for: ${searchTerm}`);
    const searchSuccessful = await plansPage.searchMinistries(searchTerm);
    expect(searchSuccessful).toBeTruthy();
    console.log(`Ministry search completed for term: ${searchTerm}`);
    return true;
  }

  /**
   * Helper for ministry page navigation tests
   */
  static async performMinistryPageTest(
    page: Page, 
    testName: string, 
    plansPage: PlansPage, 
    ministryPage: MinistryPage, 
    testFunction: () => Promise<void>
  ) {
    await plansPage.goto();
    await plansPage.expectToBeOnPlansPage();
    await testFunction();
    console.log(`${testName} verified`);
  }

  /**
   * Helper for plan page navigation tests
   */
  static async performPlanPageTest(
    page: Page, 
    testName: string, 
    plansPage: PlansPage, 
    ministryPage: MinistryPage, 
    planPage: PlanPage, 
    testFunction: () => Promise<void>
  ) {
    await plansPage.goto();
    await plansPage.expectToBeOnPlansPage();
    await testFunction();
    console.log(`${testName} verified`);
  }

  /**
   * Helper to test ministry navigation functionality
   */
  static async testMinistryNavigation(page: Page, plansPage: PlansPage, ministryPage: MinistryPage) {
    console.log('Testing ministry navigation functionality');
    const ministryClicked = await plansPage.clickFirstMinistry();
    expect(ministryClicked).toBeTruthy();
    await ministryPage.expectToBeOnMinistryPage();
    console.log('Ministry navigation verified');
    return true;
  }

  /**
   * Helper to test ministry tabs functionality
   */
  static async testMinistryTabs(page: Page, ministryPage: MinistryPage) {
    console.log('Testing ministry tabs functionality');
    const plansTabClicked = await ministryPage.clickPlansTab();
    expect(plansTabClicked).toBeTruthy();
    
    const teamsTabClicked = await ministryPage.clickTeamsTab();
    expect(teamsTabClicked).toBeTruthy();
    
    console.log('Ministry tabs functionality verified');
    return true;
  }

  /**
   * Helper to test plan creation functionality
   */
  static async testPlanCreation(page: Page, ministryPage: MinistryPage) {
    console.log('Testing plan creation functionality');
    const plansTabClicked = await ministryPage.clickPlansTab();
    expect(plansTabClicked).toBeTruthy();
    
    const addPlanClicked = await ministryPage.clickAddPlan();
    expect(addPlanClicked).toBeTruthy();
    console.log('Plan creation functionality verified');
    return true;
  }

  /**
   * Helper to test plan navigation functionality
   */
  static async testPlanNavigation(page: Page, ministryPage: MinistryPage, planPage: PlanPage) {
    console.log('Testing plan navigation functionality');
    const plansTabClicked = await ministryPage.clickPlansTab();
    expect(plansTabClicked).toBeTruthy();
    
    const planClicked = await ministryPage.clickFirstPlan();
    expect(planClicked).toBeTruthy();
    await planPage.expectToBeOnPlanPage();
    console.log('Plan navigation verified');
    return true;
  }

  /**
   * Helper to test plan tabs functionality
   */
  static async testPlanTabs(page: Page, planPage: PlanPage) {
    console.log('Testing plan tabs functionality');
    const assignmentsTabClicked = await planPage.clickAssignmentsTab();
    expect(assignmentsTabClicked).toBeTruthy();
    
    const serviceOrderTabClicked = await planPage.clickServiceOrderTab();
    expect(serviceOrderTabClicked).toBeTruthy();
    
    console.log('Plan tabs functionality verified');
    return true;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    console.log(`Testing ${componentType} page accessibility`);
    const hasTitle = await page.locator('h1').first().isVisible();
    const hasContent = await page.locator('table, .content').first().isVisible();
    expect(hasTitle || hasContent).toBeTruthy();
    console.log(`${componentType} page accessibility verified`);
    return true;
  }

  /**
   * Helper to test assignment functionality
   */
  static async testAssignmentFunctionality(page: Page, planPage: PlanPage) {
    console.log('Testing assignment functionality');
    const assignmentsTabClicked = await planPage.clickAssignmentsTab();
    expect(assignmentsTabClicked).toBeTruthy();
    
    const hasPositions = await planPage.expectPositionsTableVisible();
    expect(hasPositions).toBeTruthy();
    
    console.log('Assignment functionality verified');
    return true;
  }

  /**
   * Helper to test service order functionality
   */
  static async testServiceOrderFunctionality(page: Page, planPage: PlanPage) {
    console.log('Testing service order functionality');
    const serviceOrderTabClicked = await planPage.clickServiceOrderTab();
    expect(serviceOrderTabClicked).toBeTruthy();
    
    const hasServiceOrder = await planPage.expectServiceOrderTableVisible();
    expect(hasServiceOrder).toBeTruthy();
    
    console.log('Service order functionality verified');
    return true;
  }
}