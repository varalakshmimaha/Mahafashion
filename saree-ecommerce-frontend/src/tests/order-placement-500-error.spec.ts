import { test, expect } from '@playwright/test';

test('reproduces 500 error on order placement', async ({ page }) => {
  // Mock the necessary API endpoints
  await page.route('http://127.0.0.1:8000/api/checkout/payment-methods', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { name: 'cod', display_name: 'Cash on Delivery', is_enabled: true }
      ])
    });
  });

  // Navigate to the checkout page
  await page.goto('/checkout');

  // Fill in the shipping address
  await page.fill('input[name="fullName"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="phone"]', '1234567890');
  await page.fill('textarea[name="address"]', '123 Test St');
  await page.fill('input[name="pincode"]', '123456');
  await page.fill('input[name="city"]', 'Test City');
  await page.fill('input[name="state"]', 'Test State');

  // Select the payment method
  await page.click('input[name="payment"][value="cod"]');

  // Click the "Place Order" button
  await page.click('button:has-text("Place Order")');

  // Wait for the response and check for a 500 error
  const response = await page.waitForResponse(response =>
    response.url().includes('/api/orders') && response.status() === 500
  );

  expect(response).toBeDefined();
});