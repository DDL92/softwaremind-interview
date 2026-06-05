import { expect, type Locator, type Page } from '@playwright/test';
import type { UserCredentials } from '../utils/testData';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerLink: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByRole('textbox', { name: 'Password *', exact: true });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.registerLink = page.getByRole('link', { name: 'Register here' });
    this.errorAlert = page.locator('#login-alert');
  }

  async open(): Promise<void> {
    await this.page.goto('/login.html');
    await this.expectLoaded();
  }

  async goToRegistration(): Promise<void> {
    await this.registerLink.click();
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.signInButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/login\.html$/);
    await expect(this.page.getByRole('heading', { name: 'Product Manager' })).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toContainText('Invalid username or password');
  }

  async expectRedirectedFromRegistration(): Promise<void> {
    await expect(this.page).toHaveURL(/login\.html$/);
    await this.expectLoaded();
  }
}
