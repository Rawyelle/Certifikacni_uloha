import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../src/pages/login-page.ts";

const username = process.env.TEGB_USER_VIS as string;
const password = process.env.TEGB_PASSWORD_VIS as string;

test("Vizualni test: detail profilu screenshot", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(username, password);

  const profileSection = page.locator("//div[@data-testid='account-summary']");
  await expect(profileSection).toHaveScreenshot("profile-details.png");
});
