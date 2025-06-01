import { Page, Locator, expect } from "@playwright/test";

import { LoginPage } from "./login-page.ts";

export class RegistrationPage {
  private readonly page: Page;
  private readonly url =
    "https://tegb-frontend-88542200c6db.herokuapp.com/register";
  private readonly usernameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('//input[@data-testid="username-input"]');
    this.emailInput = page.locator('//input[@data-testid="email-input"]');
    this.passwordInput = page.locator('//input[@data-testid="password-input"]');
    this.submitButton = page.locator('//button[@data-testid="submit-button"]');
    this.successMessage = page.locator("//div[@data-testid='success-message']");
  }

  async goto(): Promise<this> {
    await this.page.goto(this.url);
    return this;
  }

  async fillRegistrationDetailes(
    username: string,
    password: string,
    email: string
  ): Promise<this> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.emailInput.fill(email);
    return this;
  }

  async submit(): Promise<LoginPage> {
    await this.submitButton.click();
    return new LoginPage(this.page);
  }
  async expectSuccess(): Promise<LoginPage> {
    await expect(this.successMessage).toBeVisible();
    return new LoginPage(this.page);
  }
}
