import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { LoginPage } from "../../src/pages/login-page.ts";

import { ApiHelper } from "../../src/api/apiHelper.ts";

test("E2E test: registrace, login FE, vytvorit ucet API, vyplnit profil a odhlasit se", async ({
  page,
}) => {
  const profileData = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    surname: faker.person.lastName(),
    phone: faker.phone.number(),
    age: faker.number.int({ min: 12, max: 99 }).toString(),
  };

  const loginPage = new LoginPage(page);
  const registration = await loginPage
    .open()
    .then((page) => page.goToRegistration());

  await registration
    .fillRegistrationDetailes(
      profileData.username,
      profileData.password,
      profileData.email
    )
    .then((r) => r.submit());

  const apiContext = await request.newContext();
  const userApi = new ApiHelper(apiContext);
  const accessToken = await userApi.getAccessToken(
    profileData.username,
    profileData.password
  );

  await test.step("Vytvorit ucet pres API", async () => {
    const createAccountResponse = await userApi.createAccount(
      accessToken,
      10000
    );
    expect(createAccountResponse.status()).toBe(201);
  });

  await test.step("Login na FE", async () => {
    const login = new LoginPage(page);
    const dashboard = await login.login(
      profileData.username,
      profileData.password
    );
    await dashboard.expectOnDashboard();

    await dashboard.openEditForm();
    await dashboard.waitForProfileFormReady();

    // Передаем все данные профиля одним объектом
    await dashboard.fillProfile(profileData);

    await dashboard.waitForFormFilled(
      profileData.username,
      profileData.surname,
      profileData.email,
      profileData.phone,
      profileData.age
    );

    await dashboard.clickSave();

    await dashboard.expectSuccessMessage();
    await expect(dashboard.usernameInput).toBeHidden(); // или другой надежный способ

    await dashboard.expectUsername(profileData.username);
    await dashboard.expectSurname(profileData.surname);
    await dashboard.expectEmail(profileData.email);
    await dashboard.expectPhone(profileData.phone);
    await dashboard.expectAge(profileData.age);

    await dashboard.expectAccountCreated("10000.00 Kč");
    await dashboard.logout();
  });
});
