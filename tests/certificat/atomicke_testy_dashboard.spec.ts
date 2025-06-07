import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../src/pages/login-page.ts";
import { DashboardPage } from "../../src/pages/dashboard.ts";
import { ApiHelper } from "../../src/api/apiHelper.ts";
import { faker } from "@faker-js/faker";

let username: string;
let password: string;
let email: string;

test.describe("Dashboard atomicke testy", () => {
  test.beforeEach(async ({ page }) => {
    // Registrujeme noveho uzivatele
    const apiContext = await request.newContext();
    const helper = new ApiHelper(apiContext);

    username = faker.internet.username();
    password = faker.internet.password();
    email = faker.internet.email();

    const registerResponse = await helper.registerUser(
      username,
      password,
      email
    );
    expect(registerResponse.status()).toBe(201);

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(username, password);
  });

  test("Navigace, detail profilu, ucty, footer, header", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect.soft(dashboard.logoImage).toBeVisible();

    //navigace
    await expect.soft(dashboard.navHome).toHaveText("Domů");
    await expect.soft(dashboard.navAccounts).toHaveText("Účty");
    await expect.soft(dashboard.navTrx).toHaveText("Transakce");
    await expect.soft(dashboard.navSupport).toHaveText("Podpora");

    //datail profilu
    await expect.soft(dashboard.profileDetails).toHaveText("Detaily Profilu");
    await expect.soft(dashboard.username).toContainText("Jméno:");
    await expect.soft(dashboard.surname).toContainText("Příjmení:");
    await expect.soft(dashboard.email).toContainText("Email:");
    await expect.soft(dashboard.phoneNumber).toContainText("Telefon:");
    await expect.soft(dashboard.age).toContainText("Věk:");

    //info o uctech
    await expect.soft(dashboard.accountsTitle).toHaveText("Účty");
    await expect.soft(dashboard.balanceTitle).toHaveText("Zůstatek");
    await expect.soft(dashboard.accountTypeTitle).toHaveText("Typ účtu");
    await expect.soft(dashboard.accountNumberTitle).toHaveText("Číslo účtu");

    //footer a header
    await expect.soft(dashboard.dashboardFooter).toBeVisible();
    await expect.soft(dashboard.dashBoardTitle).toBeVisible();
  });

  test("Funkcionalita tlacitka Upravit profil/Zrusit zmeny a visibilita tlacitka uloziz změny", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openEditForm();
    await expect.soft(dashboard.saveButton).toBeVisible();
    await expect.soft(dashboard.editButton).toHaveText("Zrušit úpravy");
    await dashboard.addAccount();
  });
});
