import { test, expect } from '@playwright/test'

test('contact form submits successfully (mocked API)', async ({ page }) => {
  await page.route('**/api/contact*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  await page.goto('/contact')
  await page.getByLabel('Name').fill('Ada Lovelace')
  await page.getByLabel('Email').fill('ada@example.com')
  await page.getByLabel('Subject').fill('Hello')
  await page
    .getByLabel('Message')
    .fill('Hi, this is a long enough test message for validation.')
  await page.getByRole('button', { name: /send message/i }).click()
  await expect(page.getByText(/your message is in/i)).toBeVisible()
})

test('contact form shows inline errors on invalid input', async ({ page }) => {
  await page.goto('/contact')
  await page.getByLabel('Email').fill('not-an-email')
  await page.getByLabel('Message').fill('short')
  await page.getByRole('button', { name: /send message/i }).click()
  // react-hook-form renders aria-invalid="true" on offending fields
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByLabel('Message')).toHaveAttribute('aria-invalid', 'true')
})
