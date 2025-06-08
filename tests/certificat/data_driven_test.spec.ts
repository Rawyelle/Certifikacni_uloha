import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";
import accountData from "../../src/assets/ddt/accountData.json";

import { LoginPage } from "../../src/pages/login-page.ts";
import { ApiHelper } from "../../src/api/apiHelper.ts";

//funkce na normalizaci stringu s zustatkem, v E2E testu to overuji jako jednoduchy text, ale neni to idealni cesta, pokazde bych musela kontrolovat jaky text presne se vraci, tahle cesta je vhodnejsi

function parseAmount(raw: string): number {
  return parseFloat(raw.replace(/\s/g, "").replace("Kč", "").replace(",", "."));
}

// funkce na normalizaci textu podle toho jak se zobrazuje na FE
function normalizeAmountForFrontendDisplay(raw: string): string {
  const num = parseAmount(raw);
  return `${num.toFixed(2)} Kč`;
}

test.describe("DDT: overeni zobrazeni zustatku", () => {
  accountData.forEach((entry, index) => {
    test(`${index + 1}. ucet se zustatkem ${entry.amount}`, async ({
      page,
    }) => {
      test.skip(
        entry.disabled === true,
        "Tato kombinace je označena jako disabled."
      );
      const apiContext = await request.newContext();
      const helper = new ApiHelper(apiContext);

      const username = faker.internet.username();
      const password = faker.internet.password();
      const email = faker.internet.email();

      // registrace noveho uzivatele, protoze kdyz to delam na tom samem, v sekci ucty se zobrazuje zprava unexpected error
      const registerResponse = await helper.registerUser(
        username,
        password,
        email
      );

      expect(registerResponse.status()).toBe(201);

      const token = await helper.getAccessToken(username, password);
      const numericAmount = parseAmount(entry.amount);

      const response = await helper.createAccount(token, numericAmount);
      expect(response.status()).toBe(201);

      const loginPage = new LoginPage(page);
      await loginPage.open();
      await loginPage.login(username, password);

      // kontrolujeme zobrazeni zustatku ktery ocekavame s tim, co skutecne ziskame
      const expectedDisplay = normalizeAmountForFrontendDisplay(entry.amount);
      await expect(
        page.locator('//td[@data-testid="account-balance"]').first()
      ).toHaveText(expectedDisplay);
    });
  });
});
