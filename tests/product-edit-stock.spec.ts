import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { adminUser, type ProductData } from '../utils/testData';

test.describe('Scenario D - Product stock edit', () => {
  test('updates USB-C Cable stock status', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    const originalProduct: ProductData = {
      name: 'USB-C Cable',
      sku: 'CAB-5005',
      price: '7.49',
      category: 'Electronics',
      inStock: true,
      description: '1m braided cable',
    };

    const updatedProduct: ProductData = {
      ...originalProduct,
      inStock: false,
    };

    await loginPage.open();
    await loginPage.login(adminUser);
    await dashboardPage.expectLoaded();
    await dashboardPage.expectProductDetailsVisible(originalProduct);

    // Act
    await dashboardPage.editProduct(originalProduct.name);
    await dashboardPage.updateStockStatus(updatedProduct.inStock);

    // Assert
    await dashboardPage.expectAddMode();
    await dashboardPage.expectProductDetailsVisible(updatedProduct);
  });
});