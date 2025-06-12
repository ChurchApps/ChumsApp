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
    
  });

  test('should navigate to form builder from forms list', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form builder navigation', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
    });
  });

  test('should display form builder with navigation tabs', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form builder display', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'form builder tabs', formPage, async () => {
        await FormsTestHelpers.testFormBuilderFunctionality(page, formPage);
      });
    });
  });

  test('should switch between form tabs', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form tabs switching', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'form tabs', formPage, async () => {
        await FormsTestHelpers.testFormBuilderFunctionality(page, formPage);
      });
    });
  });

  test('should display form settings in settings tab', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form settings display', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'form settings', formPage, async () => {
        await formPage.clickSettingsTab();
        await FormsTestHelpers.testFormSettings(page, formPage);
      });
    });
  });

  test('should have form editing functionality', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form editing functionality', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'form editing', formPage, async () => {
        await FormsTestHelpers.testFormEditingFunctionality(page, formPage);
      });
    });
  });

  test('should display form questions in questions tab', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form questions display', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'form questions', formPage, async () => {
        await formPage.clickQuestionsTab();
        await FormsTestHelpers.testFormQuestions(page, formPage);
      });
    });
  });

  test('should handle add question functionality', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'add question functionality', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'add question', formPage, async () => {
        await formPage.clickQuestionsTab();
        await FormsTestHelpers.testAddQuestionFunctionality(page, formPage);
      });
    });
  });

  test('should handle form preview functionality', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form preview functionality', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'form preview', formPage, async () => {
        await FormsTestHelpers.testFormPreview(page, formPage);
      });
    });
  });

  test('should handle form with invalid ID gracefully', async ({ page }) => {
    await page.goto('/forms/invalid-form-id');
    
    const currentUrl = page.url();
    const isOnFormsPage = currentUrl.includes('/forms') && !currentUrl.includes('invalid-form-id');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    expect(isOnFormsPage || hasErrorMessage).toBeTruthy();
    console.log('Invalid form ID handled gracefully');
  });

  test('should maintain form functionality across tabs', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form functionality across tabs', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'form tabs maintenance', formPage, async () => {
        // Test all tabs work
        await FormsTestHelpers.testFormBuilderFunctionality(page, formPage);
        
        // Page should still be functional
        const hasFormTabs = await formPage.expectFormTabsVisible();
        expect(hasFormTabs).toBeTruthy();
        console.log('Form functionality maintained across tabs');
      });
    });
  });

  test('should handle form builder navigation via URL', async ({ page }) => {
    // Direct navigation should work or redirect appropriately
    await page.goto('/forms/new');
    
    const currentUrl = page.url();
    const isOnFormBuilderPage = currentUrl.includes('/forms');
    const hasErrorMessage = await page.locator('text=Not Found, text=Error, text=Invalid').first().isVisible().catch(() => false);
    
    expect(isOnFormBuilderPage || hasErrorMessage).toBeTruthy();
    console.log('Form builder URL navigation handled');
  });

  test('should handle form submissions tab', async ({ page }) => {
    await FormsTestHelpers.performFormsPageTest(page, 'form submissions tab', formsPage, async () => {
      await FormsTestHelpers.testFormNavigation(page, formsPage);
      await FormsTestHelpers.performFormPageTest(page, 'form submissions', formPage, async () => {
        await FormsTestHelpers.testFormSubmissions(page, formPage);
      });
    });
  });
});