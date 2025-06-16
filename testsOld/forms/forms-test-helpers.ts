import { Page, expect } from '@playwright/test';
import { FormsPage } from '../pages/forms-page';
import { FormPage } from '../pages/form-page';
import { SharedSetup } from '../utils/shared-setup';

export class FormsTestHelpers {
  
  /**
   * Main helper for testing forms page functionality - expects it to work
   */
  static async performFormsPageTest(
    page: Page, 
    testName: string, 
    formsPage: FormsPage, 
    testFunction: () => Promise<void>
  ) {
    await SharedSetup.navigateDirectly(page, '/forms');
    await formsPage.expectToBeOnFormsPage();
    await testFunction();
    console.log(`${testName} verified on forms page`);
  }

  /**
   * Main helper for testing individual form page functionality - expects it to work
   */
  static async performFormPageTest(
    page: Page, 
    testName: string, 
    formPage: FormPage, 
    testFunction: () => Promise<void>
  ) {
    await testFunction();
    console.log(`${testName} verified on form page`);
  }

  /**
   * Helper to test forms display functionality
   */
  static async testFormsDisplay(page: Page, formsPage: FormsPage) {
    console.log('Testing forms display functionality');
    
    await formsPage.expectLoadingComplete();
    
    const hasFormsList = await formsPage.expectFormsDisplayed();
    expect(hasFormsList).toBeTruthy();
    
    const formsCount = await formsPage.getFormsCount();
    console.log(`Found ${formsCount} forms`);
    
    return true;
  }

  /**
   * Helper to test forms search functionality
   */
  static async testFormsSearch(page: Page, formsPage: FormsPage, searchTerm: string) {
    console.log(`Testing forms search for: ${searchTerm}`);
    
    const searchSuccessful = await formsPage.searchForms(searchTerm);
    expect(searchSuccessful).toBeTruthy();
    
    console.log(`Forms search completed for term: ${searchTerm}`);
    return true;
  }

  /**
   * Helper to test add form functionality
   */
  static async testAddFormFunctionality(page: Page, formsPage: FormsPage) {
    console.log('Testing add form functionality');
    
    const addFormClicked = await formsPage.clickAddForm();
    expect(addFormClicked).toBeTruthy();
    
    console.log('Add form functionality available');
    return true;
  }

  /**
   * Helper to test form navigation
   */
  static async testFormNavigation(page: Page, formsPage: FormsPage) {
    console.log('Testing form navigation');
    
    const formsCount = await formsPage.getFormsCount();
    expect(formsCount).toBeGreaterThan(0);
    
    const formClicked = await formsPage.clickFirstForm();
    expect(formClicked).toBeTruthy();
    
    console.log('Successfully navigated to form page');
    return true;
  }

  /**
   * Helper to test forms tabs functionality
   */
  static async testFormsTabFunctionality(page: Page, formsPage: FormsPage) {
    console.log('Testing forms tab functionality');
    
    const formsTabClicked = await formsPage.clickFormsTab();
    expect(formsTabClicked).toBeTruthy();
    console.log('Forms tab accessible');
    
    const archivedTabClicked = await formsPage.clickArchivedTab();
    expect(archivedTabClicked).toBeTruthy();
    console.log('Archived tab accessible');
    
    return true;
  }

  /**
   * Helper to test form builder functionality
   */
  static async testFormBuilderFunctionality(page: Page, formPage: FormPage) {
    console.log('Testing form builder functionality');
    
    const hasFormTabs = await formPage.expectFormTabsVisible();
    expect(hasFormTabs).toBeTruthy();
    
    const settingsTabClicked = await formPage.clickSettingsTab();
    expect(settingsTabClicked).toBeTruthy();
    console.log('Settings tab accessible');
    
    const questionsTabClicked = await formPage.clickQuestionsTab();
    expect(questionsTabClicked).toBeTruthy();
    console.log('Questions tab accessible');
    
    return true;
  }

  /**
   * Helper to test form settings functionality
   */
  static async testFormSettings(page: Page, formPage: FormPage) {
    console.log('Testing form settings');
    
    const hasFormSettings = await formPage.expectFormSettingsVisible();
    expect(hasFormSettings).toBeTruthy();
    
    console.log('Form settings displayed');
    return true;
  }

  /**
   * Helper to test form questions functionality
   */
  static async testFormQuestions(page: Page, formPage: FormPage) {
    console.log('Testing form questions');
    
    const hasQuestionsList = await formPage.expectQuestionsDisplayed();
    expect(hasQuestionsList).toBeTruthy();
    
    const questionsCount = await formPage.getQuestionsCount();
    console.log(`Found ${questionsCount} questions`);
    
    return true;
  }

  /**
   * Helper to test add question functionality
   */
  static async testAddQuestionFunctionality(page: Page, formPage: FormPage) {
    console.log('Testing add question functionality');
    
    const addQuestionClicked = await formPage.clickAddQuestion();
    expect(addQuestionClicked).toBeTruthy();
    
    console.log('Add question functionality available');
    return true;
  }

  /**
   * Helper to test form editing functionality
   */
  static async testFormEditingFunctionality(page: Page, formPage: FormPage) {
    console.log('Testing form editing functionality');
    
    const editFormClicked = await formPage.clickEditForm();
    expect(editFormClicked).toBeTruthy();
    
    console.log('Edit form functionality available');
    return true;
  }

  /**
   * Helper to test form preview functionality
   */
  static async testFormPreview(page: Page, formPage: FormPage) {
    console.log('Testing form preview');
    
    const previewTabClicked = await formPage.clickPreviewTab();
    expect(previewTabClicked).toBeTruthy();
    
    console.log('Preview functionality available');
    return true;
  }

  /**
   * Helper to test form submissions functionality
   */
  static async testFormSubmissions(page: Page, formPage: FormPage) {
    console.log('Testing form submissions');
    
    const submissionsTabClicked = await formPage.clickSubmissionsTab();
    expect(submissionsTabClicked).toBeTruthy();
    
    console.log('Submissions tab accessible');
    return true;
  }

  /**
   * Helper to test page accessibility and components
   */
  static async testPageAccessibility(page: Page, componentType: string) {
    const components = {
      formsManagement: {
        title: 'h1:has-text("Forms"), h1:has-text("Form")',
        content: '#mainContent, .forms-container, table'
      },
      formBuilder: {
        title: 'h1:has-text("Form"), h1:has-text("Builder")',
        content: '#mainContent, .form-builder, .tabs'
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
      basic: ['Form', 'Contact', 'Registration', 'Survey'],
      partial: ['For', 'Con', 'Reg'],
      caseInsensitive: ['form', 'FORM', 'Form', 'FoRm'],
      special: ['Contact Form', 'Event Registration', 'Membership Application'],
      rapid: ['F', 'Fo', 'For', 'Form']
    };
  }

  /**
   * Test data for form creation
   */
  static getTestFormData() {
    return {
      form: {
        title: 'Test Form',
        description: 'Test form description',
        active: true
      },
      question: {
        title: 'Test Question',
        type: 'text',
        required: true
      }
    };
  }
}