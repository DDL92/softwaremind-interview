import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { generateRandomId } from '../utils/randomGenerator';
import { adminUser, type ProductData } from '../utils/testData';

test.describe('Scenario C - Product CRUD Flow', () => {
  test('creates, filters, and deletes an electronics product', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const randomId = generateRandomId();
    const product: ProductData = {
      name: `Automation Laptop ${randomId}`,
      sku: `SKU${randomId.slice(-8)}`.slice(0, 16),
      price: '1500',
      category: 'Electronics',
      inStock: false,
      description: 'Created by Playwright automated CRUD coverage.'
    };

    await loginPage.open();
    await loginPage.login(adminUser);
    await dashboardPage.expectLoaded();

    // Act
    await dashboardPage.createProduct(product);

    // Assert
    await dashboardPage.expectProductDetailsVisible(product);

    // Act
    await dashboardPage.filterByCategory('Electronics');

    // Assert
    await dashboardPage.expectProductVisible(product.name);

    // Act
    await dashboardPage.deleteProduct(product.name);

    // Assert
    await dashboardPage.expectProductNotVisible(product.name);
  });
});
