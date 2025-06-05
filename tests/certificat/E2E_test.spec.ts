import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { LoginPage } from "../../src/pages/login-page.ts";
import { ApiHelper } from "../../src/api/apiHelper.ts";
test("E2E test: registrace, login FE, vytvorit ucet API, vyplnit profil a odhlasit se", async ({
  page,
}) => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const surname = faker.person.lastName();
  const phone = faker.phone.number();
  const age = faker.number.int({ min: 12, max: 99 }).toString();

  const loginPage = new LoginPage(page);
  const registration = await loginPage
    .open()
    .then((page) => page.goToRegistration());

  await registration
    .fillRegistrationDetailes(username, password, email)
    .then((r) => r.submit());

  const apiContext = await request.newContext();
  const userApi = new ApiHelper(apiContext);
  const accessToken = await userApi.getAccessToken(username, password);

  await test.step("Vytvorit ucet pres API", async () => {
    const createAccountResponse = await userApi.createAccount(
      accessToken,
      10000
    );
    expect(createAccountResponse.status()).toBe(201);
  });

  await test.step("Login na FE", async () => {
    const login = new LoginPage(page);
    const dashboard = await login.login(username, password);
    await dashboard.expectOnDashboard();

    await dashboard.openEditForm();
    await dashboard.waitForProfileFormReady();
    await dashboard.fillProfile(username, surname, email, phone, age);

    await dashboard.waitForFormFilled(username, surname, email, phone, age);

    await dashboard.clickSave();

    await dashboard.expectSuccessMessage();

    await dashboard.expectUsername(username);
    await dashboard.expectSurname(surname);
    await dashboard.expectEmail(email);
    await dashboard.expectPhone(phone);
    await dashboard.expectAge(age);

    await dashboard.expectAccountCreated("10000.00 Kč");
    await dashboard.logout();
  });
});
