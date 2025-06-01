import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../src/pages/login-page.ts";

test("Vizualni test: detail profilu screenshot", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login("Vaughn32", "_HI96q1Tq2X3rFt");

  const profileSection = page.locator("//div[@data-testid='account-summary']");
  await expect(profileSection).toHaveScreenshot("profile-details.png");
});
