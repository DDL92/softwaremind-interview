import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { generateEmail, generateUsername } from '../utils/randomGenerator';
import { saveRegisteredUser, securePassword, type UserCredentials } from '../utils/testData';

test.describe('Scenario A - Registration', () => {
  test('registers a unique user and redirects back to login page', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    const credentials: UserCredentials = {
      username: generateUsername(),
      email: generateEmail(),
      password: securePassword
    };

    await loginPage.open();
    await loginPage.expectLoaded();

    // Act
    await loginPage.goToRegistration();
    await registerPage.expectLoaded();
    await registerPage.register(credentials);

    // Assert
    await registerPage.expectRegistrationSucceeded();
    await loginPage.expectRedirectedFromRegistration();
    saveRegisteredUser(credentials);
  });
});
