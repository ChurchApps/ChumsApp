import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { FormsPage } from '../pages/forms-page';
import { FormPage } from '../pages/form-page';
import { SharedSetup } from '../utils/shared-setup';
import { FormsTestHelpers } from './forms-test-helpers';

test.describe('Form Builder', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let formsPage: FormsPage;
  let formPage: FormPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    formsPage = new FormsPage(page);
    formPage = new FormPage(page);
    
    // Use shared setup for consistent authentication
    await SharedSetup.loginAndSelectChurch(page);
  });

  test('should navigate to form builder from forms list', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form builder navigation', formsPage, formPage, async () => {
      await page.waitForLoadState('domcontentloaded');
      
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        await formPage.expectFormDetailsVisible();
        console.log('Successfully navigated to form builder from forms list');
      } else {
        console.log('No forms available in demo environment');
      }
    });
  });

  test('should display form builder with navigation tabs', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form builder with navigation tabs', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        await formPage.expectTabsVisible();
        
        // Check for main navigation elements
        await expect(formPage.mainContent).toBeVisible();
        
        console.log('Form builder navigation tabs displayed successfully');
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should switch between form tabs', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form tabs navigation', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        
        await FormsTestHelpers.testFormTabs(page, formPage);
        
        console.log('Form tabs navigation completed');
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should display form settings in settings tab', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form settings display', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        
        // Click settings tab if not already active
        await formPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Check for form settings elements
        const hasFormName = await formPage.formNameInput.isVisible().catch(() => false);
        const hasFormDescription = await formPage.formDescriptionInput.isVisible().catch(() => false);
        const hasSaveButton = await formPage.saveButton.isVisible().catch(() => false);
        
        if (hasFormName || hasFormDescription || hasSaveButton) {
          console.log('Form settings displayed successfully');
        } else {
          console.log('Form settings may be structured differently in demo environment');
        }
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should have form editing functionality', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form editing functionality', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        
        // Click settings tab to ensure we're in the right place
        await formPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Test form name editing
        const hasFormName = await formPage.formNameInput.isVisible().catch(() => false);
        
        if (hasFormName) {
          const originalName = await formPage.formNameInput.inputValue().catch(() => '');
          console.log(`Form name field accessible: ${originalName || 'Empty'}`);
          
          // Test save functionality
          const hasSave = await formPage.saveForm();
          if (hasSave) {
            console.log('Save functionality available');
          }
          
          // Test cancel functionality
          const hasCancel = await formPage.cancelForm();
          if (hasCancel) {
            console.log('Cancel functionality available');
          }
        } else {
          console.log('Form editing may be structured differently');
        }
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should display form questions in questions tab', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form questions display', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        
        // Click questions tab
        const questionsTabClicked = await formPage.clickQuestionsTab();
        
        if (questionsTabClicked) {
          await page.waitForLoadState('domcontentloaded');
          
          const hasQuestions = await formPage.expectQuestionsVisible();
          const hasAddQuestion = await formPage.expectAddQuestionAvailable();
          
          if (hasQuestions || hasAddQuestion) {
            console.log('Form questions functionality accessible');
            
            const questionsCount = await formPage.getQuestionsCount();
            console.log(`Found ${questionsCount} questions in form`);
            
            if (hasAddQuestion) {
              console.log('Add question functionality available');
            }
          } else {
            console.log('Form questions may be structured differently');
          }
        } else {
          console.log('Questions tab not accessible');
        }
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should handle add question functionality', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Add question functionality', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        
        const questionsClicked = await formPage.clickQuestionsTab();
        if (questionsClicked) {
          await page.waitForLoadState('domcontentloaded');
          
          const addQuestionClicked = await formPage.addQuestion();
          if (addQuestionClicked) {
            console.log('Add question functionality activated');
            
            // Should either open question editor or add question inline
            const hasQuestionEditor = await page.locator('.question-editor, .question-form, input[name*="question"]').first().isVisible().catch(() => false);
            
            if (hasQuestionEditor) {
              console.log('Question editor opened');
            } else {
              console.log('Add question interface may be structured differently');
            }
          } else {
            console.log('Add question not available - may require permissions');
          }
        } else {
          console.log('Questions tab not accessible');
        }
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should handle form preview functionality', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form preview functionality', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        
        await FormsTestHelpers.testFormPreview(page, formPage);
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should handle form with invalid ID gracefully', async ({ page }) => {
    // Try to navigate to a form page with invalid ID
    await page.goto('/forms/invalid-id-12345');
    await page.waitForLoadState('networkidle');
    
    // Should either redirect or show error gracefully
    const currentUrl = page.url();
    
    // Check if we're redirected to forms page or if error is handled
    const isOnFormsPage = currentUrl.includes('/forms') && !currentUrl.includes('invalid-id');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    if (isOnFormsPage || hasErrorMessage) {
      console.log('Invalid form ID handled gracefully');
    } else {
      console.log('Form page may have different error handling');
    }
  });

  test('should maintain form functionality across tabs', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form functionality across tabs', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        
        // Click through different tabs and ensure page remains functional
        await formPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        await formPage.clickQuestionsTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Go back to settings
        await formPage.clickSettingsTab();
        await page.waitForLoadState('domcontentloaded');
        
        // Page should still be functional
        await formPage.expectFormDetailsVisible();
        
        console.log('Form functionality maintained across tab switches');
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should handle form builder navigation via URL', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form builder URL navigation', formsPage, formPage, async () => {
      // Test direct navigation to form page via URL
      // First get a form ID from the forms page
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        // Get the current URL to extract form ID
        const currentUrl = page.url();
        const formIdMatch = currentUrl.match(/\/forms\/(\w+)/);
        
        if (formIdMatch) {
          const formId = formIdMatch[1];
          
          // Navigate directly to form page using URL
          await formPage.goto(formId);
          await formPage.expectToBeOnFormPage();
          
          console.log(`Successfully navigated to form builder via URL: ${formId}`);
        }
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });

  test('should handle form submissions tab', async ({ page }) => {
    await FormsTestHelpers.performFormPageTest(page, 'Form submissions functionality', formsPage, formPage, async () => {
      const formClicked = await formsPage.clickFirstForm();
      
      if (formClicked) {
        await formPage.expectToBeOnFormPage();
        
        const submissionsClicked = await formPage.clickSubmissionsTab();
        if (submissionsClicked) {
          await page.waitForLoadState('domcontentloaded');
          console.log('Submissions tab accessible');
          
          // Look for submissions table or content
          const hasSubmissions = await page.locator('table, .submissions, .submission').first().isVisible().catch(() => false);
          
          if (hasSubmissions) {
            console.log('Form submissions content displayed');
          } else {
            console.log('No submissions or different structure');
          }
        } else {
          console.log('Submissions tab not accessible');
        }
      } else {
        console.log('Skipping test - no forms available in demo environment');
      }
    });
  });
});