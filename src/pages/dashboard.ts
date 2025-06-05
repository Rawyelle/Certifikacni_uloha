import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  private readonly page: Page;
  private readonly url =
    "https://tegb-frontend-88542200c6db.herokuapp.com/dashboard";

  readonly usernameInput: Locator;
  private readonly surnameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly ageInput: Locator;

  readonly username: Locator;
  readonly surname: Locator;
  readonly email: Locator;
  readonly phomeNumber: Locator;
  readonly age: Locator;

  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly addAccountButton: Locator;

  private readonly successMessage: Locator;
  readonly logoImage: Locator;
  readonly navHome: Locator;
  readonly navAccounts: Locator;
  readonly navTrx: Locator;
  readonly navSupport: Locator;
  readonly profileDetailes: Locator;
  readonly accoumtsTitle: Locator;
  readonly balanceTitle: Locator;
  readonly accountTypeTitle: Locator;
  readonly dashboardFooter: Locator;
  readonly dashBoardTitle: Locator;
  readonly accountNumberTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editButton = page.locator(
      "//button[@data-testid='toggle-edit-profile-button']"
    );
    this.usernameInput = page.locator(
      "//input[@data-testid='chage-name-input']"
    );
    this.surnameInput = page.locator(
      "//input[@data-testid='chage-surname-input']"
    );
    this.emailInput = page.locator("//input[@data-testid='chage-email-input']");
    this.phoneInput = page.locator("//input[@data-testid='chage-phone-input']");
    this.ageInput = page.locator("//input[@data-testid='chage-age-input']");
    this.saveButton = page.locator(
      "//button[@data-testid='save-changes-button']"
    );
    this.successMessage = page.locator("//div[@class='update-message']");

    this.username = page.locator("//div[@data-testid='name']");
    this.surname = page.locator("//div[@data-testid='surname']");
    this.email = page.locator("//div[@data-testid='email']");
    this.phomeNumber = page.locator("//div[@data-testid='phone']");
    this.age = page.locator("//div[@data-testid='age']");

    this.logoImage = page.locator("//img[@data-testid='logo-img']");
    this.navHome = page.locator("//nav/ul/li[1]");
    this.navAccounts = page.locator("//nav/ul/li[2]");
    this.navTrx = page.locator("//nav/ul/li[3]");
    this.navSupport = page.locator("//nav/ul/li[4]");
    this.profileDetailes = page.locator(
      "//h2[@data-testid='profile-details-title']"
    );
    this.accoumtsTitle = page.locator("//h2[@data-testid='accounts-title']");
    this.balanceTitle = page.locator(
      "//th[@data-testid='account-balance-heading']"
    );
    this.accountTypeTitle = page.locator(
      "//th[@data-testid='account-type-heading']"
    );
    this.addAccountButton = page.locator("//button[@class='account-action']");
    this.dashboardFooter = page.locator("//footer[@class='dashboard-footer']");
    this.dashBoardTitle = page.locator("//span[@class='app-title']");
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
  }) {
    await this.usernameInput.fill(data.username);
    await this.surnameInput.fill(data.surname);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.ageInput.fill(data.age);
    return this;
  }

  async expectSuccessMessage(): Promise<this> {
    await expect(this.successMessage).toBeVisible();
    return this;
  }

  // Oddělené ověřovací metody pro jednotlivá pole misto fieldu
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
    await expect(this.phomeNumber).toContainText(expected);
    return this;
  }

  async expectAge(expected: string): Promise<this> {
    await expect(this.age).toContainText(expected);
    return this;
  }

  async expectOnDashboard(): Promise<this> {
    await expect(this.profileDetailes).toHaveText("Detaily Profilu");
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
}
