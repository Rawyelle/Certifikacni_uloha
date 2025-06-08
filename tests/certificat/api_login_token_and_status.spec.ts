import { test, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { ApiHelper } from "../../src/api/apiHelper.ts";

test("Login a status 201", async () => {
  const apiContext = await request.newContext();
  const userApi = new ApiHelper(apiContext);

  //registrace, abychom meli koho se prihlasit
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();

  const registerResponse = await userApi.registerUser(
    username,
    password,
    email
  );
  expect(registerResponse.status()).toBe(201);

  const response = await userApi.successLogin(username, password); // kontrola na status je uvnitr metody
  expect(response).toBeDefined();

  const token = await userApi.getAccessToken(username, password);
  expect(token).toBeDefined();
});
