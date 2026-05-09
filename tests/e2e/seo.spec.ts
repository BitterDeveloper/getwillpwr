import { test, expect } from '@playwright/test'

const PAGES = [
  { path: '/', titleHas: /willpwr/i },
  { path: '/pricing', titleHas: /pricing/i },
  { path: '/help', titleHas: /help/i },
  { path: '/terms', titleHas: /terms/i },
  { path: '/privacy', titleHas: /privacy/i },
  { path: '/contact', titleHas: /contact/i },
]

for (const { path, titleHas } of PAGES) {
  test(`${path} has unique title, exactly one h1, and a canonical link`, async ({ page }) => {
    await page.goto(path)
    const title = await page.title()
    expect(title.length).toBeGreaterThanOrEqual(10)
    expect(title.length).toBeLessThanOrEqual(60)
    expect(title).toMatch(titleHas)

    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(canonical).toContain(path === '/' ? 'getwillpwr.com' : path.replace(/^\//, ''))

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute('content')
    expect(ogImage).toMatch(/^https?:\/\//)

    const description = await page
      .locator('meta[name="description"]')
      .first()
      .getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThanOrEqual(50)
    expect(description!.length).toBeLessThanOrEqual(160)
  })
}
