import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { seedRegisteredUser } from '../utils/authStorage';
import { adminUser, getRegisteredUser, invalidUser } from '../utils/testData';

test.describe('Scenario B - Authentication', () => {
  test('shows an error for invalid username and password', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.expectLoaded();

    // Act
    await loginPage.login(invalidUser);

    // Assert
    await loginPage.expectInvalidCredentialsError();
  });

  test('logs in successfully and redirects to dashboard', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const registeredUser = getRegisteredUser();
    const credentials = registeredUser ?? adminUser;

    if (registeredUser) {
      await seedRegisteredUser(page, registeredUser);
    }

    await loginPage.open();

    // Act
    await loginPage.login(credentials);

    // Assert
    await dashboardPage.expectLoaded();
  });
});