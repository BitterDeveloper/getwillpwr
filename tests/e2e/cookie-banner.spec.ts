import { test, expect } from '@playwright/test'

test.describe('Cookie consent', () => {
  test('banner is visible on first visit and includes a /privacy link', async ({ page }) => {
    await page.goto('/')
    // vanilla-cookieconsent v3 renders an outer wrapper with id="cc-main"
    // and a #cm consent modal node; both work as a visibility indicator.
    const banner = page.locator('#cm, [data-cc="consent-modal"]').first()
    await expect(banner).toBeVisible({ timeout: 10_000 })
    const privacyLink = page.locator('#cm a[href*="/privacy"]').first()
    await expect(privacyLink).toBeVisible()
  })

  test('PostHog script is absent without analytics consent', async ({ page }) => {
    await page.goto('/')
    const posthogScripts = await page
      .locator('script[src*="posthog"]')
      .count()
    expect(posthogScripts).toBe(0)
  })
})
