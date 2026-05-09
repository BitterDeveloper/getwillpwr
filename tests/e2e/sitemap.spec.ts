import { test, expect } from '@playwright/test'

test.describe('SEO infra', () => {
  test('sitemap.xml is valid XML and includes every public page', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('<?xml')
    for (const path of ['/', '/pricing', '/help', '/terms', '/privacy', '/contact']) {
      expect(body).toContain(`getwillpwr.com${path}`)
    }
    // Help articles should appear too
    expect(body).toContain('/help/welcome-to-willpwr')
  })

  test('robots.txt has Sitemap directive pointing to absolute URL', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toMatch(/Sitemap:\s*https:\/\/getwillpwr\.com\/sitemap\.xml/)
    expect(body).toContain('User-agent: *')
    expect(body).toContain('Disallow: /api/')
  })
})
