import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { RegistrationPage } from "../../src/pages/registration-page.ts";
import { UserApi } from "../../src/api/userApi.ts";
import { LoginPage } from "../../src/pages/login-page.ts";
import { DashboardPage } from "../../src/pages/dashboard.ts";

test("E2E test: registrace, login FE, vytvorit ucet API, vyplnit profil a odhlasit se", async ({
  page,
}) => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const surname = faker.person.lastName();
  const phone = faker.phone.number();
  const age = faker.number.hex({ min: 12, max: 99 });

  // Registrace na FE
  const registration = new RegistrationPage(page);
  await registration
    .goto()
    .then((registration) =>
      registration.fillRegistrationDetailes(username, password, email)
    )
    .then((registration) => registration.submit());

  // Check, ze regostrace je uspesna vcetne zpravy
  await expect(page.locator(".success-message")).toContainText(
    "Registrace úspěšná"
  );

  // Definovani promenych pro API
  const apiContext = await request.newContext();
  const userApi = new UserApi(apiContext);
  const accessToken = await userApi.getAccessToken(username, password);

  /// Vytvarime ucet pres API
  await test.step("Vytvorit ucet pres API", async () => {
    const createAccountResponse = await userApi.createAccount(
      accessToken,
      10000
    );
    expect(createAccountResponse.status()).toBe(201);
  });

  // Login pres FE
  await test.step("Login na FE", async () => {
    const login = new LoginPage(page);
    await login.login(username, password);

    // Overujeme, ze jsme na dashboardu
    await expect(page.locator("text=Detaily Profilu")).toBeVisible();
  });

  // Vyplnujeme profil
  await test.step("Vyplnit uzivateli profil", async () => {
    const dashboard = new DashboardPage(page);
    await dashboard.openEditForm();
    await dashboard.waitForProfileFormReady();
    await dashboard.fillProfile(username, surname, email, phone, age);

    // Overujeme, ze profil je vyplnen uspesne pokud je videt zprava
    await dashboard.expectSuccessMessage();
    await expect(page.locator(".update-message")).toHaveText(
      "Profile updated successfully!"
    );
    // Overujeme, ze data jsou vyplnena spravne
    await dashboard.expectProfileField("username", username);
    await dashboard.expectProfileField("surname", surname);
    await dashboard.expectProfileField("email", email);
    await dashboard.expectProfileField("phone", phone);
    await dashboard.expectProfileField("age", age);
  });

  // Overujeme,ze ucet se zalozil a zustatek
  await test.step("Validujeme exidstenci uctu", async () => {
    await expect(
      page.locator("//td[@data-testid='account-number']")
    ).toBeVisible();
    await expect(
      page.locator("//td[@data-testid='account-balance']")
    ).toHaveText("10000.00 Kč");
  });

  // Logout
  await test.step("Logout", async () => {
    await page.locator('//button[@class="logout-link"]').click();
  });
});
