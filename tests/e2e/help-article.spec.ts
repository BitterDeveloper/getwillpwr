import { test, expect } from '@playwright/test'

test('help article page has a Contact Support link to /contact', async ({ page }) => {
  await page.goto('/help/welcome-to-willpwr')
  const contactLink = page.getByRole('link', { name: /contact support/i })
  await expect(contactLink).toBeVisible()
  await expect(contactLink).toHaveAttribute('href', /^\/contact\/?$/)
})

test('help index renders all three categories', async ({ page }) => {
  await page.goto('/help')
  await expect(page.getByRole('heading', { name: /getting started/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /account.*billing/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /using the app/i })).toBeVisible()
})
