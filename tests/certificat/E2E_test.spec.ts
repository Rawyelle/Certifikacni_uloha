import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { LoginPage } from "../../src/pages/login-page.ts";
import { ApiHelper } from "../../src/api/apiHelper.ts";

test("E2E test: registrace, login FE, vytvorit ucet API, vyplnit profil a odhlasit se", async ({
  page,
}) => {
  const profileData = {
    username: faker.internet.username(),
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
    .then((registration) => registration.submit());

  const apiContext = await request.newContext();
  const userApi = new ApiHelper(apiContext);
  const accessToken = await userApi.getAccessToken(
    profileData.username,
    profileData.password
  );

  await test.step("Vytvorit ucet pres API", async () => {
    const initialBalance = 10000;
    const createAccountResponse = await userApi.createAccount(
      accessToken,
      initialBalance
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
    await dashboard.expectProfileFieldsEnabled();

    await page.waitForTimeout(500); // bez tyhle pauzy to na GA padá
    await dashboard.fillProfile(profileData);
    await dashboard.waitForFormFilled(
      profileData.username,
      profileData.surname,
      profileData.email,
      profileData.phone,
      profileData.age
    );

    await page.waitForTimeout(300); // taky pro jistotu nechám, pojovala jsem s tím padáním přilíš dlouho
    await dashboard.clickSave();

    await dashboard.expectSuccessMessage();
    await dashboard.expectProfileHidden();

    await dashboard.expectProfileData(profileData);

    await dashboard.expectAccountCreated(`10000.00 Kč`);
    await dashboard.logout();
  });
});
