import { Page } from "@playwright/test";
import { DashboardPage } from "./dashboard.ts";

export class LoginPage {
  private readonly page: Page;
  private readonly url = "https://tegb-frontend-88542200c6db.herokuapp.com";

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<this> {
    await this.page.goto(this.url);
    return this;
  }

  async login(username: string, password: string): Promise<DashboardPage> {
    await this.page
      .locator('//input[@data-testid="username-input"]')
      .fill(username);
    await this.page
      .locator('//input[@data-testid="password-input"]')
      .fill(password);
    await this.page.locator('//button[@data-testid="submit-button"]').click();
    return new DashboardPage(this.page);
  }
}
