import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { LoginPage } from "../../src/pages/login-page.ts";
import { DashboardPage } from "../../src/pages/dashboard.ts";
import { ApiHelper } from "../../src/api/apiHelper.ts";

test("E2E test: registrace, login FE, vytvorit ucet API, vyplnit profil a odhlasit se", async ({
  page,
}) => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const surname = faker.person.lastName();
  const phone = faker.phone.number();
  const age = faker.number.hex({ min: 12, max: 99 });

  // 1. Login page otevřít a kliknout na "Registruj se"
  const loginPage = new LoginPage(page);
  const registration = await loginPage
    .open()
    .then((page) => page.goToRegistration());

  // 2. Vyplnit a odeslat formulář
  await registration
    .fillRegistrationDetailes(username, password, email)
    .then((registration) => registration.submit());

  // Ziskani tokenu pres API
  const apiContext = await request.newContext();
  const userApi = new ApiHelper(apiContext);
  const accessToken = await userApi.getAccessToken(username, password);

  // Vytvoreni uctu
  await test.step("Vytvorit ucet pres API", async () => {
    const createAccountResponse = await userApi.createAccount(
      accessToken,
      10000
    );
    expect(createAccountResponse.status()).toBe(201);
  });

  // Login pres frontend
  await test.step("Login na FE", async () => {
    const login = new LoginPage(page);
    const dashboard = await login.login(username, password);
    await dashboard.expectOnDashboard();
  });

  // Vyplnit profil a overit vyplneni
  await test.step("Vyplnit uzivateli profil", async () => {
    const dashboard = new DashboardPage(page);
    await dashboard.openEditForm();
    await dashboard.waitForProfileFormReady();
    await dashboard.fillProfile(username, surname, email, phone, age);
    await dashboard.expectUsername(username);
    await dashboard.expectSurname(surname);
    await dashboard.expectEmail(email);
    await dashboard.expectPhone(phone);
    await dashboard.expectAge(age);
  });

  // Ověření účtu
  await test.step("Validujeme existenci uctu", async () => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectAccountCreated("10000.00 Kč");
  });

  // Logout
  await test.step("Logout", async () => {
    const dashboard = new DashboardPage(page);
    await dashboard.logout();
  });
});
