import { Page, Locator } from "@playwright/test";
import { DashboardPage } from "./dashboard.ts";
import { RegistrationPage } from "./registration-page.ts";

export class LoginPage {
  private readonly page: Page;
  private readonly url = "https://tegb-frontend-88542200c6db.herokuapp.com";

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('//input[@data-testid="username-input"]');
    this.passwordInput = page.locator('//input[@data-testid="password-input"]');
    this.submitButton = page.locator('//button[@data-testid="submit-button"]');
    this.registerButton = page.locator(
      '//button[@data-testid="register-button"]'
    );
  }

  async open(): Promise<this> {
    await this.page.goto(this.url);
    return this;
  }

  async login(username: string, password: string): Promise<DashboardPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    return new DashboardPage(this.page);
  }

  async goToRegistration(): Promise<RegistrationPage> {
    await this.registerButton.click();
    return new RegistrationPage(this.page);
  }
}
