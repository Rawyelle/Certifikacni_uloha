import { Page, Locator, expect } from "@playwright/test";
import { LoginPage } from "./login-page.ts";

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
  readonly phoneNumber: Locator;
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
  readonly profileDetails: Locator;
  readonly accountsTitle: Locator;
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
    this.saveButton = page.locator(
      "//button[@data-testid='save-changes-button']"
    );
    this.addAccountButton = page.locator("//button[@class='account-action']");

    this.usernameInput = page.locator(
      "//input[@data-testid='chage-name-input']"
    );
    this.surnameInput = page.locator(
      "//input[@data-testid='chage-surname-input']"
    );
    this.emailInput = page.locator("//input[@data-testid='chage-email-input']");
    this.phoneInput = page.locator("//input[@data-testid='chage-phone-input']");
    this.ageInput = page.locator("//input[@data-testid='chage-age-input']");

    this.username = page.locator("//div[@data-testid='name']");
    this.surname = page.locator("//div[@data-testid='surname']");
    this.email = page.locator("//div[@data-testid='email']");
    this.phoneNumber = page.locator("//div[@data-testid='phone']");
    this.age = page.locator("//div[@data-testid='age']");

    this.successMessage = page.locator("//div[@class='update-message']");
    this.logoImage = page.locator("//img[@data-testid='logo-img']");
    this.dashboardFooter = page.locator("//footer[@class='dashboard-footer']");
    this.dashBoardTitle = page.locator("//span[@class='app-title']");

    this.navHome = page.locator("//nav/ul/li[1]");
    this.navAccounts = page.locator("//nav/ul/li[2]");
    this.navTrx = page.locator("//nav/ul/li[3]");
    this.navSupport = page.locator("//nav/ul/li[4]");

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

  // Opravena metoda fillProfile pro dynamickou kontrolou existence pole - komentar od tebe, ze pokud bude dalsi pole, test to neodhali
  async fillProfile(data: { [key: string]: string }): Promise<this> {
    const inputs: { [key: string]: Locator } = {
      username: this.usernameInput,
      surname: this.surnameInput,
      email: this.emailInput,
      phone: this.phoneInput,
      age: this.ageInput,
    };

    for (const key of Object.keys(data)) {
      if (inputs[key]) {
        await inputs[key].fill(data[key]);
      } else {
        throw new Error(`Pole pro "${key}" nebylo nalezeno`);
      }
    }
    return this;
  }

  // Opravena metoda expectProfileData pro dynamickou kontrolou a použitím toHaveText misto toContainText
  async expectProfileData(data: { [key: string]: string }): Promise<this> {
    const profileFields: { [key: string]: Locator } = {
      username: this.username,
      surname: this.surname,
      email: this.email,
      phone: this.phoneNumber,
      age: this.age,
    };

    for (const [key, expectedValue] of Object.entries(data)) {
      const locator = profileFields[key];
      if (!locator) {
        throw new Error(`Lokator profilu pro pole "${key}" nebyl nalezen`);
      }

      const strongLocator = locator.locator("strong");
      const strongText = (await strongLocator.textContent())?.trim() ?? "";

      const fullText = (await locator.textContent())?.trim() ?? "";
      // Odstraníme ze zobrazeného textu zvyrazneny text a mezery
      const actualValue = fullText.replace(strongText, "").trim();

      if (actualValue !== expectedValue) {
        throw new Error(
          `Nesouhlasi pole "${key}": ocekavano "${expectedValue}", ale prislo "${actualValue}"`
        );
      }
    }

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

  // Pridani uctu kliknutim na tlacitko, zatim nefunguje
  async addAccount(): Promise<this> {
    await this.addAccountButton.click();
    return this;
  }

  async logout(): Promise<LoginPage> {
    await this.page.locator('//button[@class="logout-link"]').click();
    return new LoginPage(this.page);
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

  async expectSuccessMessage(): Promise<this> {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toHaveText(
      "Profile updated successfully!"
    );
    return this;
  }

  async expectProfileFieldsEnabled(): Promise<this> {
    await expect(this.usernameInput).toBeEnabled();
    await expect(this.surnameInput).toBeEnabled();
    await expect(this.emailInput).toBeEnabled();
    await expect(this.phoneInput).toBeEnabled();
    await expect(this.ageInput).toBeEnabled();
    return this;
  }

  async expectProfileHidden(): Promise<this> {
    await expect(this.usernameInput).toBeHidden();
    await expect(this.surnameInput).toBeHidden();
    await expect(this.emailInput).toBeHidden();
    await expect(this.phoneInput).toBeHidden();
    await expect(this.ageInput).toBeHidden();
    return this;
  }
}
