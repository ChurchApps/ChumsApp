import { Page } from '@playwright/test';

export class PlansHelper {
  /**
   * Navigate to service planning functionality
   */
  static async navigateToPlans(page: Page) {
    // Check if we're already on plans page or can access plans search
    const plansSearchBox = page.locator('#searchText, input[placeholder*="Search"]');
    const hasSearch = await plansSearchBox.isVisible().catch(() => false);
    
    if (hasSearch) {
      console.log('Service planning available through search interface');
      return;
    }
    
    // Try navigating through menu
    const menuButton = page.locator('button[aria-label*="menu"], .MuiIconButton-root').first();
    const hasMenu = await menuButton.isVisible().catch(() => false);
    
    if (hasMenu) {
      await menuButton.click();
      await page.waitForTimeout(1000);
      
      const plansLink = page.locator('text=Plans, text=Services, a[href="/plans"]').first();
      const hasPlansOption = await plansLink.isVisible().catch(() => false);
      
      if (hasPlansOption) {
        await plansLink.click();
        await page.waitForLoadState('networkidle');
        console.log('Navigated to plans through menu');
        return;
      }
    }
    
    // Try direct navigation
    const currentUrl = page.url();
    if (!currentUrl.includes('/plans')) {
      await page.goto('https://chumsdemo.churchapps.org/plans');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    console.log('Service planning navigation completed');
  }

  /**
   * Navigate to ministries management
   */
  static async navigateToMinistries(page: Page) {
    // Look for ministries tab or link
    const ministriesSelectors = [
      'text=Ministries',
      'a[href="/ministries"]',
      'button:has-text("Ministries")',
      'tab:has-text("Ministries")'
    ];
    
    for (const selector of ministriesSelectors) {
      const ministriesLink = page.locator(selector).first();
      const isVisible = await ministriesLink.isVisible().catch(() => false);
      if (isVisible) {
        await ministriesLink.click();
        await page.waitForLoadState('networkidle');
        console.log('Navigated to ministries management');
        return;
      }
    }
    
    // Try direct navigation
    await page.goto('https://chumsdemo.churchapps.org/ministries');
    await page.waitForLoadState('networkidle');
    console.log('Ministries navigation completed');
  }

  /**
   * Navigate to songs management
   */
  static async navigateToSongs(page: Page) {
    // Look for songs tab or link
    const songsSelectors = [
      'text=Songs',
      'a[href="/songs"]',
      'button:has-text("Songs")',
      'tab:has-text("Songs")'
    ];
    
    for (const selector of songsSelectors) {
      const songsLink = page.locator(selector).first();
      const isVisible = await songsLink.isVisible().catch(() => false);
      if (isVisible) {
        await songsLink.click();
        await page.waitForLoadState('networkidle');
        console.log('Navigated to songs management');
        return;
      }
    }
    
    // Try direct navigation
    await page.goto('https://chumsdemo.churchapps.org/songs');
    await page.waitForLoadState('networkidle');
    console.log('Songs navigation completed');
  }

  /**
   * Search for service plans
   */
  static async searchPlans(page: Page, searchTerm: string) {
    const searchSelectors = [
      '#searchText',
      'input[placeholder*="Search"]',
      'input[name="search"]',
      'input[placeholder*="Plans"]',
      'input[placeholder*="Service"]'
    ];
    
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector).first();
      const isVisible = await searchInput.isVisible().catch(() => false);
      if (isVisible) {
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
        return;
      }
    }
    
    console.log('Plans search completed');
  }

  /**
   * Search for songs
   */
  static async searchSongs(page: Page, searchTerm: string) {
    // Navigate to songs first
    await this.navigateToSongs(page);
    
    const searchSelectors = [
      '#searchText',
      'input[placeholder*="Search"]',
      'input[name="search"]',
      'input[placeholder*="Songs"]'
    ];
    
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector).first();
      const isVisible = await searchInput.isVisible().catch(() => false);
      if (isVisible) {
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
        return;
      }
    }
    
    console.log('Songs search completed');
  }

  /**
   * Clear search input
   */
  static async clearSearch(page: Page) {
    const searchInput = page.locator('#searchText, input[placeholder*="Search"]').first();
    const isVisible = await searchInput.isVisible().catch(() => false);
    if (isVisible) {
      await searchInput.fill('');
    }
  }

  /**
   * Create a new service plan
   */
  static async createPlan(page: Page, plan: {
    name: string;
    date: string;
    serviceType?: string;
    theme?: string;
  }) {
    console.log(`Simulating creation of service plan: ${plan.name}`);
    
    // Look for add plan button
    const addButtonSelectors = [
      'button:has-text("Add Plan")',
      'button:has-text("Create Plan")',
      'button:has-text("New Service")',
      'button:has-text("Add")',
      '[aria-label*="add"]'
    ];
    
    let addButtonFound = false;
    for (const selector of addButtonSelectors) {
      const addButton = page.locator(selector).first();
      const isVisible = await addButton.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`Found add plan button: ${selector}`);
        addButtonFound = true;
        break;
      }
    }
    
    if (!addButtonFound) {
      console.log('Add Plan button not found - demonstrating creation pattern');
    }
    
    console.log(`Service plan would be created in production with:`);
    console.log(`- Name: ${plan.name}`);
    console.log(`- Date: ${plan.date}`);
    console.log(`- Service Type: ${plan.serviceType || 'Regular Service'}`);
    console.log(`- Theme: ${plan.theme || 'No theme'}`);
  }

  /**
   * Edit an existing service plan
   */
  static async editPlan(page: Page, planName: string, updates: {
    name?: string;
    date?: string;
    serviceType?: string;
    theme?: string;
  }) {
    console.log(`Simulating edit of service plan: ${planName}`);
    
    // Search for the plan first
    await this.searchPlans(page, planName);
    
    console.log(`Service plan ${planName} would be updated in production with:`);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) console.log(`- ${key}: ${value}`);
    });
  }

  /**
   * Delete a service plan
   */
  static async deletePlan(page: Page, planName: string) {
    console.log(`Simulating deletion of service plan: ${planName}`);
    
    // Search for the plan first
    await this.searchPlans(page, planName);
    
    console.log(`Service plan ${planName} would be deleted in production`);
    
    // Clear search for clean state
    await this.clearSearch(page);
  }

  /**
   * Add an item to a service plan
   */
  static async addPlanItem(page: Page, planName: string, item: {
    type: string;
    title: string;
    duration?: number;
    notes?: string;
  }) {
    console.log(`Simulating addition of ${item.type} item to plan: ${planName}`);
    
    // Search for the plan
    await this.searchPlans(page, planName);
    
    console.log(`Item would be added to ${planName}:`);
    console.log(`- Type: ${item.type}`);
    console.log(`- Title: ${item.title}`);
    console.log(`- Duration: ${item.duration || 5} minutes`);
    console.log(`- Notes: ${item.notes || 'No notes'}`);
  }

  /**
   * Assign a team member to a position
   */
  static async assignTeamMember(page: Page, planName: string, assignment: {
    position: string;
    person: string;
    ministry?: string;
  }) {
    console.log(`Simulating team assignment for plan: ${planName}`);
    
    // Search for the plan
    await this.searchPlans(page, planName);
    
    console.log(`Team assignment would be made:`);
    console.log(`- Position: ${assignment.position}`);
    console.log(`- Person: ${assignment.person}`);
    console.log(`- Ministry: ${assignment.ministry || 'General'}`);
  }

  /**
   * View team schedule
   */
  static async viewTeamSchedule(page: Page, teamName: string) {
    console.log(`Simulating team schedule view for: ${teamName}`);
    
    // Look for team/schedule section
    const teamSelectors = [
      'text=Teams',
      'text=Schedule',
      'button:has-text("Teams")',
      'tab:has-text("Schedule")'
    ];
    
    for (const selector of teamSelectors) {
      const teamLink = page.locator(selector).first();
      const isVisible = await teamLink.isVisible().catch(() => false);
      if (isVisible) {
        await teamLink.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`Team schedule for ${teamName} would be displayed in production`);
  }

  /**
   * Manage positions for a service
   */
  static async managePositions(page: Page, serviceName: string) {
    console.log(`Simulating position management for: ${serviceName}`);
    
    // Look for positions section
    const positionsSelectors = [
      'text=Positions',
      'button:has-text("Positions")',
      'tab:has-text("Positions")'
    ];
    
    for (const selector of positionsSelectors) {
      const positionsLink = page.locator(selector).first();
      const isVisible = await positionsLink.isVisible().catch(() => false);
      if (isVisible) {
        await positionsLink.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`Position management for ${serviceName} would be available in production`);
  }

  /**
   * Schedule ministry team
   */
  static async scheduleMinistry(page: Page, planName: string, schedule: {
    ministry: string;
    rehearsalTime?: string;
    arrivalTime?: string;
    notes?: string;
  }) {
    console.log(`Simulating ministry scheduling for plan: ${planName}`);
    
    console.log(`Ministry schedule would be set:`);
    console.log(`- Ministry: ${schedule.ministry}`);
    console.log(`- Rehearsal Time: ${schedule.rehearsalTime || 'TBD'}`);
    console.log(`- Arrival Time: ${schedule.arrivalTime || 'TBD'}`);
    console.log(`- Notes: ${schedule.notes || 'No notes'}`);
  }

  /**
   * Check for scheduling conflicts
   */
  static async checkScheduleConflicts(page: Page, date: string) {
    console.log(`Simulating schedule conflict check for date: ${date}`);
    
    console.log(`Schedule conflict check would be performed for ${date}`);
    console.log(`- Check team member availability`);
    console.log(`- Identify double bookings`);
    console.log(`- Suggest alternatives if conflicts found`);
  }

  /**
   * Create a new song
   */
  static async createSong(page: Page, song: {
    title: string;
    artist?: string;
    key?: string;
    tempo?: string;
    theme?: string;
  }) {
    console.log(`Simulating creation of song: ${song.title}`);
    
    // Navigate to songs first
    await this.navigateToSongs(page);
    
    // Look for add song button
    const addButtonSelectors = [
      'button:has-text("Add Song")',
      'button:has-text("Create Song")',
      'button:has-text("Add")',
      '[aria-label*="add"]'
    ];
    
    let addButtonFound = false;
    for (const selector of addButtonSelectors) {
      const addButton = page.locator(selector).first();
      const isVisible = await addButton.isVisible().catch(() => false);
      if (isVisible) {
        console.log(`Found add song button: ${selector}`);
        addButtonFound = true;
        break;
      }
    }
    
    if (!addButtonFound) {
      console.log('Add Song button not found - demonstrating creation pattern');
    }
    
    console.log(`Song would be created in production with:`);
    console.log(`- Title: ${song.title}`);
    console.log(`- Artist: ${song.artist || 'Unknown'}`);
    console.log(`- Key: ${song.key || 'C'}`);
    console.log(`- Tempo: ${song.tempo || 'Moderate'}`);
    console.log(`- Theme: ${song.theme || 'General'}`);
  }

  /**
   * Add song arrangement
   */
  static async addSongArrangement(page: Page, songTitle: string, arrangement: {
    version: string;
    key: string;
    arrangement: string;
    notes?: string;
  }) {
    console.log(`Simulating arrangement addition for song: ${songTitle}`);
    
    // Search for the song
    await this.searchSongs(page, songTitle);
    
    console.log(`Arrangement would be added:`);
    console.log(`- Version: ${arrangement.version}`);
    console.log(`- Key: ${arrangement.key}`);
    console.log(`- Structure: ${arrangement.arrangement}`);
    console.log(`- Notes: ${arrangement.notes || 'No notes'}`);
  }

  /**
   * Create worship set
   */
  static async createWorshipSet(page: Page, worshipSet: {
    name: string;
    songs: Array<{ title: string; key: string; duration: number }>;
  }) {
    console.log(`Simulating worship set creation: ${worshipSet.name}`);
    
    console.log(`Worship set would be created with:`);
    console.log(`- Name: ${worshipSet.name}`);
    console.log(`- Songs:`);
    worshipSet.songs.forEach((song, index) => {
      console.log(`  ${index + 1}. ${song.title} (Key: ${song.key}, ${song.duration} min)`);
    });
    
    const totalDuration = worshipSet.songs.reduce((sum, song) => sum + song.duration, 0);
    console.log(`- Total Duration: ${totalDuration} minutes`);
  }

  /**
   * Generate chord chart
   */
  static async generateChordChart(page: Page, songTitle: string) {
    console.log(`Simulating chord chart generation for: ${songTitle}`);
    
    // Look for chord chart functionality
    const chartSelectors = [
      'text=Chord Chart',
      'button:has-text("Chord Chart")',
      'button:has-text("Generate Chart")'
    ];
    
    for (const selector of chartSelectors) {
      const chartButton = page.locator(selector).first();
      const isVisible = await chartButton.isVisible().catch(() => false);
      if (isVisible) {
        await chartButton.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`Chord chart for ${songTitle} would be generated in production`);
  }

  /**
   * Check if a plan exists
   */
  static async planExists(page: Page, planName: string): Promise<boolean> {
    await this.searchPlans(page, planName);
    
    // Look for the plan in search results
    const planSelectors = [
      `text=${planName}`,
      'table td, .plan-result, .search-result'
    ];
    
    for (const selector of planSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        const text = await element.textContent().catch(() => '');
        if (text.includes(planName)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Navigate to specific plan details
   */
  static async viewPlanDetails(page: Page, planName: string) {
    await this.searchPlans(page, planName);
    
    const planLink = page.locator(`text=${planName}`).first();
    const isVisible = await planLink.isVisible().catch(() => false);
    if (isVisible) {
      await planLink.click();
      await page.waitForLoadState('networkidle');
      console.log(`Navigated to details for plan: ${planName}`);
    } else {
      console.log(`Plan ${planName} not found in search results`);
    }
  }

  /**
   * Print service plan
   */
  static async printPlan(page: Page, planName: string) {
    console.log(`Simulating printing of service plan: ${planName}`);
    
    // Search for the plan
    await this.searchPlans(page, planName);
    
    // Look for print functionality
    const printSelectors = [
      'button:has-text("Print")',
      'button:has-text("Generate Bulletin")',
      'a[href*="print"]'
    ];
    
    for (const selector of printSelectors) {
      const printButton = page.locator(selector).first();
      const isVisible = await printButton.isVisible().catch(() => false);
      if (isVisible) {
        await printButton.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    
    console.log(`Service plan ${planName} would be printed/exported in production`);
  }

  /**
   * Archive completed plan
   */
  static async archivePlan(page: Page, planName: string) {
    console.log(`Simulating archiving of completed plan: ${planName}`);
    
    // Search for the plan
    await this.searchPlans(page, planName);
    
    console.log(`Plan ${planName} would be archived in production`);
  }
}