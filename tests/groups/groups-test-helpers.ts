import { Page, expect } from '@playwright/test';
import { GroupsPage } from '../pages/groups-page';
import { GroupPage } from '../pages/group-page';

export class GroupsTestHelpers {
  
  /**
   * Main helper for testing groups page functionality
   */
  static async performGroupsPageTest(
    page: Page, 
    testName: string, 
    groupsPage: GroupsPage, 
    testFunction: () => Promise<void>
  ) {
    await groupsPage.goto();
    await groupsPage.expectToBeOnGroupsPage();
    await testFunction();
    console.log(`${testName} verified on groups page`);
  }

  /**
   * Helper for testing groups display functionality
   */
  static async testGroupsDisplay(page: Page, groupsPage: GroupsPage) {
    console.log('Testing groups display functionality');
    await groupsPage.expectLoadingComplete();
    const hasDisplay = await groupsPage.expectGroupsDisplayed();
    expect(hasDisplay).toBeTruthy();
    const count = await groupsPage.getGroupsCount();
    console.log(`Found ${count} groups`);
    return true;
  }

  /**
   * Helper for testing groups search functionality
   */
  static async testGroupsSearch(page: Page, groupsPage: GroupsPage, searchTerm: string) {
    console.log(`Testing groups search for: ${searchTerm}`);
    const searchSuccessful = await groupsPage.searchGroups(searchTerm);
    expect(searchSuccessful).toBeTruthy();
    console.log(`Groups search completed for term: ${searchTerm}`);
    return true;
  }

  /**
   * Helper for testing add group functionality
   */
  static async testAddGroup(page: Page, groupsPage: GroupsPage) {
    console.log('Testing add group functionality');
    const addGroupClicked = await groupsPage.clickAddGroup();
    expect(addGroupClicked).toBeTruthy();
    console.log('Add group functionality verified');
    return true;
  }

  /**
   * Helper for group page navigation tests
   */
  static async performGroupPageTest(
    page: Page, 
    testName: string, 
    groupsPage: GroupsPage, 
    groupPage: GroupPage, 
    testFunction: () => Promise<void>
  ) {
    await groupsPage.goto();
    await groupsPage.expectToBeOnGroupsPage();
    await testFunction();
    console.log(`${testName} verified`);
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    console.log(`Testing ${componentType} page accessibility`);
    const hasTitle = await page.locator('h1').first().isVisible();
    const hasSearchBox = await page.locator('input[placeholder*="Search"]').first().isVisible();
    expect(hasTitle || hasSearchBox).toBeTruthy();
    console.log(`${componentType} page accessibility verified`);
    return true;
  }

  /**
   * Helper to test group navigation functionality
   */
  static async testGroupNavigation(page: Page, groupsPage: GroupsPage, groupPage: GroupPage) {
    console.log('Testing group navigation functionality');
    const groupClicked = await groupsPage.clickFirstGroup();
    expect(groupClicked).toBeTruthy();
    await groupPage.expectToBeOnGroupPage();
    console.log('Group navigation verified');
    return true;
  }

  /**
   * Helper to test group editing functionality
   */
  static async testGroupEditing(page: Page, groupsPage: GroupsPage, groupPage: GroupPage) {
    console.log('Testing group editing functionality');
    const groupClicked = await groupsPage.clickFirstGroup();
    expect(groupClicked).toBeTruthy();
    
    await groupPage.expectToBeOnGroupPage();
    const settingsClicked = await groupPage.clickSettingsTab();
    expect(settingsClicked).toBeTruthy();
    
    const editClicked = await groupPage.editGroup();
    expect(editClicked).toBeTruthy();
    console.log('Group editing functionality verified');
    return true;
  }

  /**
   * Helper to test group tabs functionality
   */
  static async testGroupTabs(page: Page, groupPage: GroupPage) {
    console.log('Testing group tabs functionality');
    const tabsVisible = await groupPage.expectTabsVisible();
    expect(tabsVisible).toBeTruthy();
    console.log('Group tabs functionality verified');
    return true;
  }

  /**
   * Helper to test group members functionality
   */
  static async testGroupMembers(page: Page, groupPage: GroupPage) {
    console.log('Testing group members functionality');
    const membersTabClicked = await groupPage.clickMembersTab();
    expect(membersTabClicked).toBeTruthy();
    
    const hasMembersTable = await groupPage.expectMembersTableVisible();
    expect(hasMembersTable).toBeTruthy();
    
    const membersCount = await groupPage.getMembersCount();
    console.log(`Found ${membersCount} members in group`);
    console.log('Group members functionality verified');
    return true;
  }

  /**
   * Helper to test group sessions functionality
   */
  static async testGroupSessions(page: Page, groupPage: GroupPage) {
    console.log('Testing group sessions functionality');
    const sessionsTabClicked = await groupPage.clickSessionsTab();
    expect(sessionsTabClicked).toBeTruthy();
    
    const hasSessionsTable = await groupPage.expectSessionsTableVisible();
    expect(hasSessionsTable).toBeTruthy();
    
    const sessionsCount = await groupPage.getSessionsCount();
    console.log(`Found ${sessionsCount} sessions in group`);
    console.log('Group sessions functionality verified');
    return true;
  }
}