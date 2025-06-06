import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  private readonly page: Page;
  private readonly url =
    "https://tegb-frontend-88542200c6db.herokuapp.com/dashboard";

  // Inputs
  readonly usernameInput: Locator;
  private readonly surnameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly ageInput: Locator;

  // Profile outputs
  readonly username: Locator;
  readonly surname: Locator;
  readonly email: Locator;
  readonly phoneNumber: Locator;
  readonly age: Locator;

  // Buttons
  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly addAccountButton: Locator;

  // UI Elements
  private readonly successMessage: Locator;
  readonly logoImage: Locator;
  readonly navHome: Locator;
  readonly navAccounts: Locator;
  readonly navTrx: Locator;
  readonly navSupport: Locator;
  readonly profileDetails: Locator;
  readonly accountsTitle: Locator;
  readonly balanceTitle: Locator;
  readonly accountTypeTitle: Locator;
  readonly dashboardFooter: Locator;
  readonly dashBoardTitle: Locator;
  readonly accountNumberTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Buttons
    this.editButton = page.locator(
      "//button[@data-testid='toggle-edit-profile-button']"
    );
    this.saveButton = page.locator(
      "//button[@data-testid='save-changes-button']"
    );
    this.addAccountButton = page.locator("//button[@class='account-action']");

    // Inputs
    this.usernameInput = page.locator(
      "//input[@data-testid='chage-name-input']"
    );
    this.surnameInput = page.locator(
      "//input[@data-testid='chage-surname-input']"
    );
    this.emailInput = page.locator("//input[@data-testid='chage-email-input']");
    this.phoneInput = page.locator("//input[@data-testid='chage-phone-input']");
    this.ageInput = page.locator("//input[@data-testid='chage-age-input']");

    // Outputs
    this.username = page.locator("//div[@data-testid='name']");
    this.surname = page.locator("//div[@data-testid='surname']");
    this.email = page.locator("//div[@data-testid='email']");
    this.phoneNumber = page.locator("//div[@data-testid='phone']");
    this.age = page.locator("//div[@data-testid='age']");

    // Misc
    this.successMessage = page.locator("//div[@class='update-message']");
    this.logoImage = page.locator("//img[@data-testid='logo-img']");
    this.dashboardFooter = page.locator("//footer[@class='dashboard-footer']");
    this.dashBoardTitle = page.locator("//span[@class='app-title']");

    // Navigation
    this.navHome = page.locator("//nav/ul/li[1]");
    this.navAccounts = page.locator("//nav/ul/li[2]");
    this.navTrx = page.locator("//nav/ul/li[3]");
    this.navSupport = page.locator("//nav/ul/li[4]");

    // Section Titles
    this.profileDetails = page.locator(
      "//h2[@data-testid='profile-details-title']"
    );
    this.accountsTitle = page.locator("//h2[@data-testid='accounts-title']");
    this.balanceTitle = page.locator(
      "//th[@data-testid='account-balance-heading']"
    );
    this.accountTypeTitle = page.locator(
      "//th[@data-testid='account-type-heading']"
    );
    this.accountNumberTitle = page.locator(
      "//th[@data-testid='account-number-heading']"
    );
  }

  async goto(): Promise<this> {
    await this.page.goto(this.url);
    return this;
  }

  async openEditForm(): Promise<this> {
    await this.editButton.click();
    return this;
  }

  async waitForProfileFormReady(): Promise<this> {
    await expect(this.saveButton).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEnabled();
    return this;
  }

  async fillProfile(data: {
    username: string;
    surname: string;
    email: string;
    phone: string;
    age: string;
  }): Promise<this> {
    await this.typeInField(this.usernameInput, data.username);
    await this.typeInField(this.surnameInput, data.surname);
    await this.typeInField(this.emailInput, data.email);
    await this.typeInField(this.phoneInput, data.phone);
    await this.typeInField(this.ageInput, data.age);
    return this;
  }

  private async typeInField(field: Locator, value: string): Promise<void> {
    await field.click();
    await field.press("Control+A");
    await field.press("Delete");
    await field.type(value, { delay: 50 });
  }

  async expectSuccessMessage(): Promise<this> {
    await expect(this.successMessage).toBeVisible();
    return this;
  }

  async expectUsername(expected: string): Promise<this> {
    await expect(this.username).toContainText(expected);
    return this;
  }

  async expectSurname(expected: string): Promise<this> {
    await expect(this.surname).toContainText(expected);
    return this;
  }

  async expectEmail(expected: string): Promise<this> {
    await expect(this.email).toContainText(expected);
    return this;
  }

  async expectPhone(expected: string): Promise<this> {
    await expect(this.phoneNumber).toContainText(expected);
    return this;
  }

  async expectAge(expected: string): Promise<this> {
    await expect(this.age).toContainText(expected);
    return this;
  }

  async expectOnDashboard(): Promise<this> {
    await expect(this.profileDetails).toHaveText("Detaily Profilu");
    return this;
  }

  async expectAccountCreated(balance: string): Promise<this> {
    const accountNumber = this.page.locator(
      "//td[@data-testid='account-number']"
    );
    const accountBalance = this.page.locator(
      "//td[@data-testid='account-balance']"
    );
    await expect(accountNumber).toBeVisible();
    await expect(accountBalance).toHaveText(balance);
    return this;
  }

  async addAccount(): Promise<this> {
    await this.addAccountButton.click();
    return this;
  }

  async logout(): Promise<void> {
    await this.page.locator('//button[@class="logout-link"]').click();
  }

  async waitForFormFilled(
    username: string,
    surname: string,
    email: string,
    phone: string,
    age: string
  ): Promise<this> {
    await expect(this.usernameInput).toHaveValue(username);
    await expect(this.surnameInput).toHaveValue(surname);
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.phoneInput).toHaveValue(phone);
    await expect(this.ageInput).toHaveValue(age);
    return this;
  }

  async clickSave(): Promise<this> {
    await this.saveButton.click();
    return this;
  }

  async expectProfileFieldsEnabled(): Promise<void> {
    await expect(this.usernameInput).toBeEnabled();
    await expect(this.surnameInput).toBeEnabled();
    await expect(this.emailInput).toBeEnabled();
    await expect(this.phoneInput).toBeEnabled();
    await expect(this.ageInput).toBeEnabled();
  }

  async expectProfileHidden(): Promise<void> {
    await expect(this.usernameInput).toBeHidden();
    await expect(this.surnameInput).toBeHidden();
    await expect(this.emailInput).toBeHidden();
    await expect(this.phoneInput).toBeHidden();
    await expect(this.ageInput).toBeHidden();
  }

  async expectProfileData(data: {
    username: string;
    surname: string;
    email: string;
    phone: string;
    age: string;
  }): Promise<this> {
    await this.expectUsername(data.username);
    await this.expectSurname(data.surname);
    await this.expectEmail(data.email);
    await this.expectPhone(data.phone);
    await this.expectAge(data.age);
    return this;
  }
}
