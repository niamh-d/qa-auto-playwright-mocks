import { test, expect } from '@playwright/test';

const serviceURL = 'http://localhost:3000/';
const routeToMock = '**/api/loan-calc?amount=*&period=*'

test('main flow', async ({ page }) => {
  await page.route(routeToMock, async (route) => {

    await route.fulfill({
      status: 400,
    });
  });

  await page.goto(serviceURL)
  await expect(page.getByTestId('id-small-loan-calculator-field-error')).toBeVisible()
});

test.only('positive scenario', async ({ page }) => {

  const valueMock = 42.8

  await page.route(routeToMock, async (route) => {
    const mockResponse = {
      paymentAmountMonthly: valueMock,
    };

    await route.fulfill({
      status: 200,
      body: JSON.stringify(mockResponse),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  await page.goto(serviceURL)
  await page.waitForResponse(routeToMock)
  const amount = await page.getByTestId('ib-small-loan-calculator-field-monthlyPayment').textContent()
  expect(amount).toBe(`${valueMock} €`)
});