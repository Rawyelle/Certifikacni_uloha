import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export class ApiHelper {
  private readonly request: APIRequestContext;
  private readonly apiUrl =
    "https://tegb-backend-877a0b063d29.herokuapp.com/tegb";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async loginUser(username: string, password: string): Promise<APIResponse> {
    const response = await this.request.post(`${this.apiUrl}/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username,
        password,
      },
    });
    return response;
  }
  async successLogin(username: string, password: string): Promise<APIResponse> {
    const response = await this.loginUser(username, password);
    expect(response.status()).toBe(201);
    return response;
  }

  async getAccessToken(username: string, password: string): Promise<string> {
    const response = await this.loginUser(username, password);
    expect(response.status()).toBe(201);
    const body = await response.json();
    return body.access_token;
  }

  async createAccount(
    token: string,
    startBalanec: number
  ): Promise<APIResponse> {
    return this.request.post(`${this.apiUrl}/accounts/create`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        startBalance: startBalanec,
        type: "Test",
      },
    });
  }

  async registerUser(
    username: string,
    password: string,
    email: string
  ): Promise<APIResponse> {
    return this.request.post(`${this.apiUrl}/register`, {
      data: {
        username,
        password,
        email,
      },
    });
  }
}
