import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  private readonly page: Page;
  private readonly url =
    "https://tegb-frontend-88542200c6db.herokuapp.com/dashboard";
  readonly editButton: Locator;
  private readonly usernameInput: Locator;
  private readonly surnameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly ageInput: Locator;
  readonly saveButton: Locator;
  private readonly successMessage: Locator;
  readonly logoImage: Locator;
  readonly navHome: Locator;
  readonly navAccounts: Locator;
  readonly navTrx: Locator;
  readonly navSupport: Locator;
  readonly profileDetailes: Locator;
  readonly username: Locator;
  readonly surname: Locator;
  readonly email: Locator;
  readonly phomeNumber: Locator;
  readonly age: Locator;
  readonly accoumtsTitle: Locator;
  readonly balanceTitle: Locator;
  readonly accountTypeTitle: Locator;
  readonly addAccountButton: Locator;
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

    this.logoImage = page.locator("//img[@data-testid='logo-img']");
    this.navHome = page.locator("//nav/ul/li[1]");
    this.navAccounts = page.locator("//nav/ul/li[2]");
    this.navTrx = page.locator("//nav/ul/li[3]");
    this.navSupport = page.locator("//nav/ul/li[4]");
    this.profileDetailes = page.locator(
      "//h2[@data-testid='profile-details-title']"
    );
    this.username = page.locator("//div[@data-testid='name']");
    this.surname = page.locator("//div[@data-testid='surname']");
    this.email = page.locator("//div[@data-testid='email']");
    this.phomeNumber = page.locator("//div[@data-testid='phone']");
    this.age = page.locator("//div[@data-testid='age']");
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

  async fillProfile(
    username: string,
    surname: string,
    email: string,
    phone: string,
    age: string
  ): Promise<this> {
    const delay = 100;

    await this.usernameInput.focus();
    await this.page.waitForTimeout(100);
    await this.usernameInput.type(username, { delay });

    await this.surnameInput.focus();
    await this.page.waitForTimeout(100);
    await this.surnameInput.type(surname, { delay });

    await this.emailInput.focus();
    await this.page.waitForTimeout(100);
    await this.emailInput.type(email, { delay });

    await this.phoneInput.focus();
    await this.page.waitForTimeout(100);
    await this.phoneInput.type(phone, { delay });

    await this.ageInput.focus();
    await this.page.waitForTimeout(100);
    await this.ageInput.type(age, { delay });

    await this.saveButton.click();
    return this;
  }

  async expectSuccessMessage(): Promise<this> {
    await expect(this.successMessage).toBeVisible();
    return this;
  }

  async expectProfileField(
    field: "username" | "surname" | "email" | "phone" | "age",
    expectedSubstring: string
  ) {
    const fieldMap = {
      username: this.username,
      surname: this.surname,
      email: this.email,
      phone: this.phomeNumber,
      age: this.age,
    };

    const actualText = await fieldMap[field].textContent();
    expect(actualText).toContain(expectedSubstring);
  }

  async addAccount(): Promise<this> {
    await this.addAccountButton.click();
    return this;
  }

  async waitForProfileFormReady(): Promise<this> {
    await expect(this.saveButton).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEnabled();
    await this.page.waitForTimeout(2000);
    return this;
  }
}
