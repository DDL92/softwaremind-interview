import { expect, type Locator, type Page } from '@playwright/test';
import type { UserCredentials } from '../utils/testData';

export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByRole('textbox', { name: 'Password *', exact: true });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password *' });
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.successAlert = page.locator('#register-alert');
  }

  async register(credentials: UserCredentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.emailInput.fill(credentials.email ?? '');
    await this.passwordInput.fill(credentials.password);
    await this.confirmPasswordInput.fill(credentials.password);
    await this.registerButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/register\.html$/);
    await expect(this.page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }

  async expectRegistrationSucceeded(): Promise<void> {
    await expect(this.successAlert).toBeVisible();
    await expect(this.successAlert).toContainText('Registration successful');
  }
}
