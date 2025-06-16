import { Page, expect } from '@playwright/test';

export class PeopleHelper {
  /**
   * Navigate to people page
   */
  static async navigateToPeople(page: Page) {
    // First check if we need to navigate
    const currentUrl = page.url();
    if (!currentUrl.includes('/people')) {
      // Try direct navigation first
      await page.goto('https://chumsdemo.churchapps.org/people');
      await page.waitForLoadState('networkidle');
      
      // If still on login page, we need to go through the main navigation
      if (page.url().includes('/login')) {
        await page.goto('https://chumsdemo.churchapps.org/');
        await page.waitForLoadState('networkidle');
        
        // Use the navigation menu
        const peopleLink = page.locator('a[href="/people"], nav a:has-text("People")').first();
        const linkVisible = await peopleLink.isVisible().catch(() => false);
        
        if (linkVisible) {
          await peopleLink.click();
        } else {
          // Try the menu button first
          const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")').first();
          if (await menuButton.isVisible()) {
            await menuButton.click();
            await page.waitForTimeout(500);
            
            const peopleMenuItem = page.locator('a[href="/people"], text=People').first();
            await peopleMenuItem.click();
          }
        }
        
        await page.waitForLoadState('networkidle');
      }
    }
  }

  /**
   * Search for a person by name
   */
  static async searchPerson(page: Page, searchTerm: string) {
    const searchInput = page.locator('#searchText, input[placeholder*="Search"]').first();
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');
    await page.waitForLoadState('networkidle');
  }

  /**
   * Create a new person with basic information
   */
  static async createPerson(page: Page, person: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate?: string;
  }) {
    // Click add person button
    const addButton = page.locator('button:has-text("Add Person"), button:has-text("Add"), [aria-label*="add"]').first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Fill in person details
    await page.fill('input[name="firstName"], input[placeholder*="First"]', person.firstName);
    await page.fill('input[name="lastName"], input[placeholder*="Last"]', person.lastName);
    
    if (person.email) {
      await page.fill('input[name="email"], input[type="email"]', person.email);
    }
    
    if (person.phone) {
      await page.fill('input[name="phone"], input[type="tel"]', person.phone);
    }
    
    if (person.birthDate) {
      await page.fill('input[name="birthDate"], input[type="date"]', person.birthDate);
    }

    // Save the person
    const saveButton = page.locator('button:has-text("Save"), button[type="submit"]').first();
    await saveButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
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
   * Check if a person exists
   */
  static async personExists(page: Page, firstName: string, lastName: string): Promise<boolean> {
    await this.searchPerson(page, `${firstName} ${lastName}`);
    const personLink = page.locator(`text=${firstName} ${lastName}`).first();
    return await personLink.isVisible().catch(() => false);
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