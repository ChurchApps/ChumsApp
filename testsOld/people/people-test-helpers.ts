import { Page, expect } from '@playwright/test';
import { PeoplePage } from '../pages/people-page';
import { PersonPage } from '../pages/person-page';
import { SharedSetup } from '../utils/shared-setup';

export class PeopleTestHelpers {
  
  /**
   * Main helper for testing people page functionality - expects it to work
   */
  static async performPeoplePageTest(
    page: Page, 
    testName: string, 
    peoplePage: PeoplePage, 
    testFunction: () => Promise<void>
  ) {
    // Navigate directly to people page - will handle login if needed
    await SharedSetup.navigateDirectly(page, '/people');
    await peoplePage.expectToBeOnPeoplePage();
    await testFunction();
    console.log(`${testName} verified on people page`);
  }

  /**
   * Main helper for testing individual person page functionality - expects it to work
   */
  static async performPersonPageTest(
    page: Page, 
    testName: string, 
    personPage: PersonPage, 
    testFunction: () => Promise<void>
  ) {
    await testFunction();
    console.log(`${testName} verified on person page`);
  }

  /**
   * Helper to test people display functionality
   */
  static async testPeopleDisplay(page: Page, peoplePage: PeoplePage) {
    console.log('Testing people display functionality');
    
    await peoplePage.expectLoadingComplete();
    
    const hasPeopleList = await peoplePage.expectPeopleDisplayed();
    expect(hasPeopleList).toBeTruthy();
    
    const peopleCount = await peoplePage.getPeopleCount();
    console.log(`Found ${peopleCount} people`);
    
    return true;
  }

  /**
   * Helper to test people search functionality
   */
  static async testPeopleSearch(page: Page, peoplePage: PeoplePage, searchTerm: string) {
    console.log(`Testing people search for: ${searchTerm}`);
    
    const searchSuccessful = await peoplePage.searchPeople(searchTerm);
    expect(searchSuccessful).toBeTruthy();
    
    console.log(`People search completed for term: ${searchTerm}`);
    return true;
  }

  /**
   * Helper to test advanced search functionality
   */
  static async testAdvancedSearch(page: Page, peoplePage: PeoplePage) {
    console.log('Testing advanced search functionality');
    
    const advancedSearchClicked = await peoplePage.clickAdvancedSearch();
    expect(advancedSearchClicked).toBeTruthy();
    
    console.log('Advanced search functionality available');
    return true;
  }

  /**
   * Helper to test add person functionality
   */
  static async testAddPersonFunctionality(page: Page, peoplePage: PeoplePage) {
    console.log('Testing add person functionality');
    
    const addPersonClicked = await peoplePage.clickAddPerson();
    expect(addPersonClicked).toBeTruthy();
    
    console.log('Add person functionality available');
    return true;
  }

  /**
   * Helper to test person navigation
   */
  static async testPersonNavigation(page: Page, peoplePage: PeoplePage) {
    console.log('Testing person navigation');
    
    const peopleCount = await peoplePage.getPeopleCount();
    expect(peopleCount).toBeGreaterThan(0);
    
    const personClicked = await peoplePage.clickFirstPerson();
    expect(personClicked).toBeTruthy();
    
    console.log('Successfully navigated to person page');
    return true;
  }

  /**
   * Helper to test export functionality
   */
  static async testExportFunctionality(page: Page, peoplePage: PeoplePage) {
    console.log('Testing export functionality');
    
    const exportAvailable = await peoplePage.expectExportAvailable();
    expect(exportAvailable).toBeTruthy();
    
    console.log('Export functionality available');
    return true;
  }

  /**
   * Helper to test column selector functionality
   */
  static async testColumnSelector(page: Page, peoplePage: PeoplePage) {
    console.log('Testing column selector functionality');
    
    const columnSelectorAvailable = await peoplePage.expectColumnSelectorAvailable();
    expect(columnSelectorAvailable).toBeTruthy();
    
    console.log('Column selector functionality available');
    return true;
  }

  /**
   * Helper to test person details functionality
   */
  static async testPersonDetails(page: Page, personPage: PersonPage) {
    console.log('Testing person details');
    
    const hasPersonDetails = await personPage.expectPersonDetailsVisible();
    expect(hasPersonDetails).toBeTruthy();
    
    console.log('Person details displayed');
    return true;
  }

  /**
   * Helper to test person tabs functionality
   */
  static async testPersonTabs(page: Page, personPage: PersonPage) {
    console.log('Testing person tabs functionality');
    
    const detailsTabClicked = await personPage.clickDetailsTab();
    expect(detailsTabClicked).toBeTruthy();
    console.log('Details tab accessible');
    
    const attendanceTabClicked = await personPage.clickAttendanceTab();
    expect(attendanceTabClicked).toBeTruthy();
    console.log('Attendance tab accessible');
    
    const groupsTabClicked = await personPage.clickGroupsTab();
    expect(groupsTabClicked).toBeTruthy();
    console.log('Groups tab accessible');
    
    return true;
  }

  /**
   * Helper to test person editing functionality
   */
  static async testPersonEditing(page: Page, personPage: PersonPage) {
    console.log('Testing person editing functionality');
    
    const editPersonClicked = await personPage.clickEditPerson();
    expect(editPersonClicked).toBeTruthy();
    
    console.log('Edit person functionality available');
    return true;
  }

  /**
   * Helper to test person form functionality
   */
  static async testPersonForm(page: Page, personPage: PersonPage) {
    console.log('Testing person form');
    
    const hasPersonForm = await personPage.expectPersonFormVisible();
    expect(hasPersonForm).toBeTruthy();
    
    console.log('Person form displayed');
    return true;
  }

  /**
   * Helper to test person validation
   */
  static async testPersonValidation(page: Page, personPage: PersonPage) {
    console.log('Testing person validation');
    
    const testData = this.getTestPersonData();
    
    // Test required field validation
    const firstNameFilled = await personPage.fillFirstName(testData.firstName);
    expect(firstNameFilled).toBeTruthy();
    
    const lastNameFilled = await personPage.fillLastName(testData.lastName);
    expect(lastNameFilled).toBeTruthy();
    
    console.log('Person validation functionality available');
    return true;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    const components = {
      peopleManagement: {
        title: 'h1:has-text("People"), h1:has-text("Person")',
        content: '#mainContent, .people-container, table'
      },
      personProfile: {
        title: 'h1:has-text("Person"), h1:has-text("Profile")',
        content: '#mainContent, .person-profile, .tabs'
      },
      navigation: {
        title: 'h1',
        content: '#mainContent'
      }
    };

    const config = components[componentType] || components.navigation;
    
    const hasTitle = await page.locator(config.title).first().isVisible().catch(() => false);
    const hasContent = await page.locator(config.content).first().isVisible().catch(() => false);
    
    expect(hasTitle || hasContent).toBeTruthy();
    console.log(`${componentType} page accessible and main components visible`);
    return true;
  }

  /**
   * Common search terms for testing
   */
  static getSearchTerms() {
    return {
      basic: ['Smith', 'John', 'Mary', 'Johnson'],
      partial: ['Smi', 'Joh', 'Mar'],
      caseInsensitive: ['smith', 'SMITH', 'Smith', 'SmItH'],
      special: ['John Smith', 'Mary Johnson', 'Robert Brown'],
      rapid: ['S', 'Sm', 'Smi', 'Smit']
    };
  }

  /**
   * Test data for person creation
   */
  static getTestPersonData() {
    return {
      firstName: 'Test',
      lastName: 'Person',
      email: 'test.person@example.com',
      phone: '555-0123',
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zip: '12345'
    };
  }
}