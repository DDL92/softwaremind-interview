import { expect, type Locator, type Page } from '@playwright/test';
import type { ProductData } from '../utils/testData';

export class DashboardPage {
  readonly page: Page;
  readonly productNameInput: Locator;
  readonly productSkuInput: Locator;
  readonly productPriceInput: Locator;
  readonly productCategorySelect: Locator;
  readonly productDescriptionInput: Locator;
  readonly productStockCheckbox: Locator;
  readonly productStockToggle: Locator;
  readonly productFormTitle: Locator;
  readonly saveButton: Locator;
  readonly categoryFilter: Locator;
  readonly productList: Locator;
  readonly deleteConfirmationButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productNameInput = page.getByRole('textbox', { name: 'Name *', exact: true });
    this.productSkuInput = page.getByRole('textbox', { name: 'SKU *', exact: true });
    this.productPriceInput = page.getByRole('spinbutton', { name: 'Price *', exact: true });
    this.productCategorySelect = page.getByRole('combobox', { name: 'Category *', exact: true });
    this.productDescriptionInput = page.getByLabel('Description');
    this.productStockCheckbox = page.locator('#product-inStock');
    this.productStockToggle = page.locator('label[for="product-inStock"]');
    this.productFormTitle = page.getByRole('heading', { name: /^(Add|Edit) Product$/ });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.categoryFilter = page.getByLabel('Filter by category');
    this.productList = page.getByRole('region', { name: 'Product list' });
    this.deleteConfirmationButton = page.getByRole('dialog').getByRole('button', { name: 'Delete' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/index\.html$/);
    await expect(this.page.getByRole('heading', { name: 'Product Manager (VanillaJS)' })).toBeVisible();
    await expect(this.productList).toBeVisible();
  }

  async createProduct(product: ProductData): Promise<void> {
    await this.productNameInput.fill(product.name);
    await this.productSkuInput.fill(product.sku);
    await this.productPriceInput.fill(product.price);
    await this.productCategorySelect.selectOption(product.category);
    await this.setStockStatus(product.inStock);

    if (product.description) {
      await this.productDescriptionInput.fill(product.description);
    }

    await this.saveButton.click();
  }

  async filterByCategory(category: ProductData['category'] | 'All'): Promise<void> {
    await this.categoryFilter.selectOption(category);
  }

  async editProduct(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: `Edit ${productName}` }).click();
    await this.expectEditMode();
  }

  async updateStockStatus(inStock: boolean): Promise<void> {
    await this.setStockStatus(inStock);
    await this.saveButton.click();
  }

  async deleteProduct(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: `Delete ${productName}` }).click();
    await expect(this.page.getByRole('dialog')).toBeVisible();
    await this.deleteConfirmationButton.click();
  }

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.productCard(productName)).toBeVisible();
  }

  async expectProductDetailsVisible(product: ProductData): Promise<void> {
    const productCard = this.productCard(product.name);

    await expect(productCard).toBeVisible();
    await expect(productCard).toContainText(product.sku);
    await expect(productCard).toContainText(this.formatPrice(product.price));
    await expect(productCard).toContainText(product.category);
    await expect(productCard).toContainText(product.inStock ? 'In Stock' : 'Out of Stock');

    if (product.description) {
      await expect(productCard).toContainText(product.description);
    }
  }

  async expectProductNotVisible(productName: string): Promise<void> {
    await expect(this.productCard(productName)).toHaveCount(0);
  }

  async expectEditMode(): Promise<void> {
    await expect(this.productFormTitle).toHaveText('Edit Product');
    await expect(this.page.getByRole('button', { name: 'Cancel Edit' })).toBeVisible();
  }

  async expectAddMode(): Promise<void> {
    await expect(this.productFormTitle).toHaveText('Add Product');
    await expect(this.page.getByRole('button', { name: 'Cancel Edit' })).toBeHidden();
  }

  private productCard(productName: string): Locator {
    return this.productList.locator('.product-card').filter({
      has: this.page.getByRole('heading', { name: productName, exact: true })
    });
  }

  private async setStockStatus(shouldBeInStock: boolean): Promise<void> {
    const isChecked = await this.productStockCheckbox.isChecked();

    if (isChecked !== shouldBeInStock) {
      await this.productStockToggle.click();
    }

    await expect(this.productStockCheckbox).toBeChecked({ checked: shouldBeInStock });
  }

  private formatPrice(price: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(price));
  }
}
