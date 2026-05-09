import { test, expect } from '@playwright/test'

test('custom 404 page has links to / and /help', async ({ page }) => {
  const res = await page.goto('/this-route-does-not-exist')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/')
  await expect(page.getByRole('link', { name: /help center/i })).toHaveAttribute(
    'href',
    /^\/help\/?$/,
  )
})
