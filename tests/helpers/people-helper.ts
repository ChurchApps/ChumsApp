import { Page } from '@playwright/test';

export class PeopleHelper {
  /**
   * Navigate to people page - either by clicking People search button or verifying we're in the right place
   */
  static async navigateToPeople(page: Page) {
    // First try using the data-testid attribute
    const peopleNavItem = page.locator('[data-testid="nav-item-people"]').first();
    const hasTestId = await peopleNavItem.isVisible().catch(() => false);
    
    if (hasTestId) {
      console.log('✓ Found People navigation with data-testid');
      await peopleNavItem.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log('✓ Navigated to People page');
      return;
    }
    
    // Fallback: Check if we can see a People section with search functionality
    const peopleSection = page.locator('text=People').first();
    const hasPeopleSection = await peopleSection.isVisible().catch(() => false);
    
    if (hasPeopleSection) {
      console.log('✓ Found People section on dashboard');
      
      // Click the Search button in the People section to navigate to full people page
      const searchButton = page.locator('button[aria-label="Search people"], button:has-text("Search")').first();
      const hasSearchButton = await searchButton.isVisible().catch(() => false);
      
      if (hasSearchButton) {
        console.log('✓ Clicking People search button to navigate to people page');
        await searchButton.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        console.log('✓ Navigated to People page');
      } else {
        console.log('⚠ People section found but no search button visible');
      }
    } else {
      // If not on dashboard, try to find menu navigation using data-testid first
      const peopleMenuSelectors = ['[data-testid="nav-item-people"]', 'a[href="/people"]', 'button:has-text("People")', 'a:has-text("People")'];
      
      let navigationFound = false;
      for (const selector of peopleMenuSelectors) {
        const element = page.locator(selector).first();
        const exists = await element.isVisible().catch(() => false);
        if (exists) {
          console.log(`✓ Found People navigation with selector: ${selector}`);
          await element.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
          navigationFound = true;
          break;
        }
      }
      
      if (!navigationFound) {
        throw new Error('Could not find People section or navigation');
      }
    }
  }

  /**
   * Search for a person by name
   */
  static async searchPerson(page: Page, searchTerm: string) {
    // Try to fill the first available search input
    const searchInputs = ['[data-testid="people-search-input"] input', '[data-testid="dashboard-people-search-input"] input', '#searchText', 'input[placeholder*="Search"]', 'input[name="search"]'];
    
    for (const selector of searchInputs) {
      try {
        const input = page.locator(selector).first();
        const isVisible = await input.isVisible().catch(() => false);
        if (isVisible) {
          await input.fill(searchTerm);
          await input.press('Enter');
          await page.waitForLoadState('networkidle');
          return;
        }
      } catch {
        // Continue to next selector
        continue;
      }
    }
    
    throw new Error('Could not find a valid search input field');
  }

  /**
   * Create a new person using the CreatePerson component at bottom of people list
   */
  static async createPerson(page: Page, person: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate?: string;
  }) {
    console.log(`Creating person: ${person.firstName} ${person.lastName}`);
    
    // Make sure we're on the people page
    await this.navigateToPeople(page);
    
    // Scroll to bottom to find the CreatePerson component
    await page.locator('hr').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Look for the CreatePerson form at the bottom (after the <hr />)
    // Based on apphelper CreatePerson component, fields are likely named "first", "last", "email"
    const firstNameSelectors = ['input[name="first"]', 'input[aria-label="firstName"]', 'input[placeholder*="First"]'];
    
    let firstNameField = null;
    for (const selector of firstNameSelectors) {
      const field = page.locator(selector).last(); // Use .last() since we want the CreatePerson form at bottom
      const exists = await field.isVisible().catch(() => false);
      if (exists) {
        console.log(`✓ Found first name field with selector: ${selector}`);
        firstNameField = field;
        break;
      }
    }
    
    if (!firstNameField) {
      // Debug: List all input fields to see what's available
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      console.log(`Debugging: Found ${inputCount} input fields on people page:`);
      for (let i = Math.max(0, inputCount - 10); i < inputCount; i++) {
        const input = inputs.nth(i);
        const name = await input.getAttribute('name').catch(() => 'no-name');
        const placeholder = await input.getAttribute('placeholder').catch(() => 'no-placeholder');
        const ariaLabel = await input.getAttribute('aria-label').catch(() => 'no-aria-label');
        console.log(`  Input ${i}: name="${name}" placeholder="${placeholder}" aria-label="${ariaLabel}"`);
      }
      throw new Error('Could not find CreatePerson form at bottom of people list');
    }
    
    // Fill the CreatePerson form
    await firstNameField.fill(person.firstName);
    
    // Fill last name
    const lastNameSelectors = ['input[name="last"]', 'input[aria-label="lastName"]', 'input[placeholder*="Last"]'];
    
    let lastNameSet = false;
    for (const selector of lastNameSelectors) {
      const field = page.locator(selector).last();
      const exists = await field.isVisible().catch(() => false);
      if (exists) {
        await field.fill(person.lastName);
        lastNameSet = true;
        console.log(`✓ Set last name with selector: ${selector}`);
        break;
      }
    }
    
    if (!lastNameSet) {
      console.log('⚠ Could not find last name field');
    }
    
    // Fill email if provided
    if (person.email) {
      const emailSelectors = ['input[name="email"]', 'input[aria-label="email"]', 'input[type="email"]'];
      
      let emailSet = false;
      for (const selector of emailSelectors) {
        const field = page.locator(selector).last();
        const exists = await field.isVisible().catch(() => false);
        if (exists) {
          await field.fill(person.email);
          emailSet = true;
          console.log(`✓ Set email with selector: ${selector}`);
          break;
        }
      }
      
      if (!emailSet) {
        console.log('⚠ Could not find email field');
      }
    }
    
    // Click the Add button
    const addButtons = ['button:has-text("Add")', 'button[type="submit"]', 'button:has-text("Create")', 'button:has-text("Save")'];
    
    let buttonClicked = false;
    for (const selector of addButtons) {
      const button = page.locator(selector).last();
      const exists = await button.isVisible().catch(() => false);
      if (exists) {
        console.log(`✓ Found and clicking add button with selector: ${selector}`);
        await button.click();
        buttonClicked = true;
        break;
      }
    }
    
    if (!buttonClicked) {
      throw new Error('Could not find Add/Submit button in CreatePerson form');
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log(`✓ Person ${person.firstName} ${person.lastName} creation submitted`);
  }

  /**
   * Alternative method: Create person through search interface
   */
  static async createPersonThroughSearch(page: Page, person: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  }) {
    // Navigate to people page first
    await page.goto('/people');
    await page.waitForLoadState('networkidle');
    
    // Search for the person first to trigger "create new" option
    await this.searchPerson(page, `${person.firstName} ${person.lastName}`);
    await page.waitForTimeout(1500);
    
    // Look for "Create new person" or CreatePerson component
    const createButtons = ['button:has-text("Create new person")', 'button:has-text("Create Person")', '[data-testid="create-person-button"]', 'button:has-text("Add Person")', '.create-person'];
    
    let createClicked = false;
    for (const selector of createButtons) {
      const button = page.locator(selector).first();
      const isVisible = await button.isVisible().catch(() => false);
      if (isVisible) {
        await button.click();
        createClicked = true;
        console.log(`Found and clicked create button: ${selector}`);
        break;
      }
    }
    
    if (!createClicked) {
      // Try to navigate directly to add person page
      await page.goto('/people/add');
      await page.waitForLoadState('networkidle');
    }
    
    await page.waitForTimeout(1000);
    
    // Fill the form using correct selectors
    await page.fill('[data-testid="first-name-input"], #first', person.firstName);
    await page.fill('[data-testid="last-name-input"], #last', person.lastName);
    
    if (person.email) {
      await page.fill('[data-testid="email-input"], #email', person.email);
    }
    
    if (person.phone) {
      // Try different phone field options
      const phoneSelectors = ['#homePhone input', '#workPhone input', '#mobilePhone input'];
      
      for (const selector of phoneSelectors) {
        const phoneInput = page.locator(selector).first();
        const phoneExists = await phoneInput.isVisible().catch(() => false);
        if (phoneExists) {
          await phoneInput.fill(person.phone);
          break;
        }
      }
    }
    
    // Save
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');
    
    console.log(`✓ Person creation workflow completed`);
  }

  /**
   * Get the person ID from the current URL after creation/navigation
   */
  static async getCurrentPersonId(page: Page): Promise<string | null> {
    const url = page.url();
    const match = url.match(/\/people\/(\d+)/);
    return match ? match[1] : null;
  }

  /**
   * Navigate to person details page by ID
   */
  static async navigateToPersonDetails(page: Page, personId: string) {
    await page.goto(`/people/${personId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }

  /**
   * Verify we're on a person details page
   */
  static async isOnPersonDetailsPage(page: Page): Promise<boolean> {
    const url = page.url();
    return /\/people\/\d+/.test(url);
  }
  
  /**
   * Helper function to fill the first available input from a list of selectors
   */
  static async fillFirstAvailableInput(page: Page, selectors: string[], value: string) {
    for (const selector of selectors) {
      const input = page.locator(selector).first();
      const isVisible = await input.isVisible().catch(() => false);
      if (isVisible) {
        await input.fill(value);
        return;
      }
    }
    console.log(`Warning: Could not find input field for value: ${value}`);
  }

  /**
   * Edit an existing person
   */
  static async editPerson(page: Page, updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) {
    // Click edit button
    const editButton = page.locator('button:has-text("Edit"), [aria-label*="edit"]').first();
    await editButton.click();
    await page.waitForTimeout(1000);

    // Update fields
    if (updates.firstName) {
      await page.fill('input[name="firstName"]', updates.firstName);
    }
    if (updates.lastName) {
      await page.fill('input[name="lastName"]', updates.lastName);
    }
    if (updates.email) {
      await page.fill('input[name="email"]', updates.email);
    }
    if (updates.phone) {
      await page.fill('input[name="phone"]', updates.phone);
    }

    // Save changes
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Delete a person
   */
  static async deletePerson(page: Page, firstName: string, lastName: string) {
    // Search for the person first
    await this.searchPerson(page, `${firstName} ${lastName}`);
    
    // Click on the person to view details
    const personLink = page.locator(`text=${firstName} ${lastName}`).first();
    const personExists = await personLink.isVisible().catch(() => false);
    
    if (personExists) {
      await personLink.click();
      await page.waitForLoadState('networkidle');
      
      // Look for delete button
      const deleteButton = page.locator('button:has-text("Delete"), [aria-label*="delete"]').first();
      const deleteExists = await deleteButton.isVisible().catch(() => false);
      
      if (deleteExists) {
        await deleteButton.click();
        
        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').last();
        await confirmButton.click();
        await page.waitForLoadState('networkidle');
        
        return true;
      }
    }
    
    return false;
  }

  /**
   * Create a household
   */
  static async createHousehold(page: Page, householdName: string, address?: {
    address1: string;
    city: string;
    state: string;
    zip: string;
  }) {
    // Click add household button
    const addHouseholdButton = page.locator('button:has-text("Household"), button:has-text("Create Household")').first();
    await addHouseholdButton.click();
    await page.waitForTimeout(1000);

    // Fill household name
    await page.fill('input[name="householdName"], input[placeholder*="Household"]', householdName);

    // Fill address if provided
    if (address) {
      await page.fill('input[name="address1"], input[placeholder*="Address"]', address.address1);
      await page.fill('input[name="city"], input[placeholder*="City"]', address.city);
      await page.fill('input[name="state"], input[placeholder*="State"]', address.state);
      await page.fill('input[name="zip"], input[placeholder*="Zip"]', address.zip);
    }

    // Save household
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Add person to household
   */
  static async addToHousehold(page: Page, role: 'Head' | 'Spouse' | 'Child' | 'Other') {
    const householdButton = page.locator('button:has-text("Household"), button:has-text("Add to Household")').first();
    await householdButton.click();
    await page.waitForTimeout(1000);

    // Select role
    const roleSelect = page.locator('select[name="role"], [aria-label*="role"]').first();
    await roleSelect.selectOption(role);

    // Save
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Check if a person exists using search
   */
  static async personExists(page: Page, firstName: string, lastName: string): Promise<boolean> {
    await this.searchPerson(page, `${firstName} ${lastName}`);
    
    // Look for the person in search results
    const personSelectors = [`text=${firstName} ${lastName}`, `text=${firstName}`, `text=${lastName}`, 'table td, .person-result, .search-result'];
    
    for (const selector of personSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        const text = await element.textContent().catch(() => '');
        if (text.includes(firstName) && text.includes(lastName)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Clean up test data - delete person if exists
   */
  static async cleanupPerson(page: Page, firstName: string, lastName: string) {
    const exists = await this.personExists(page, firstName, lastName);
    if (exists) {
      await this.deletePerson(page, firstName, lastName);
    }
  }

  /**
   * Navigate to person details
   */
  static async viewPersonDetails(page: Page, firstName: string, lastName: string) {
    await this.searchPerson(page, `${firstName} ${lastName}`);
    const personLink = page.locator(`text=${firstName} ${lastName}`).first();
    await personLink.click();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Verify person details are displayed
   */
  static async verifyPersonDetails(page: Page, expectedDetails: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  }): Promise<boolean> {
    const fullName = `${expectedDetails.firstName} ${expectedDetails.lastName}`;
    const hasName = await page.locator(`text=${fullName}`).isVisible().catch(() => false);
    
    let hasEmail = true;
    let hasPhone = true;
    
    if (expectedDetails.email) {
      hasEmail = await page.locator(`text=${expectedDetails.email}`).isVisible().catch(() => false);
    }
    
    if (expectedDetails.phone) {
      hasPhone = await page.locator(`text=${expectedDetails.phone}`).isVisible().catch(() => false);
    }
    
    return hasName && hasEmail && hasPhone;
  }
}