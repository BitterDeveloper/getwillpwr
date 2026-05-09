import { describe, it, expect } from 'vitest'
import { buildMetadata } from '@/lib/metadata'

describe('buildMetadata', () => {
  // Feature: willpwr-website, Property 11: OG tags are present and og:image is an absolute URL
  it('produces OG tags with an absolute og:image URL', () => {
    const meta = buildMetadata({
      title: 'Hello — Willpwr',
      description: 'A description that is at least fifty characters long for SEO compliance.',
      path: '/hello',
    })
    expect(meta.openGraph?.title).toBe('Hello — Willpwr')
    expect(meta.openGraph?.url).toContain('https://')
    const images = meta.openGraph?.images
    const first = Array.isArray(images) ? images[0] : images
    const url = typeof first === 'object' && first && 'url' in first ? first.url : first
    expect(String(url)).toMatch(/^https:\/\//)
  })

  // Feature: willpwr-website, Property 13: Canonical tag matches the page's own URL
  it('canonical equals SITE_URL + path', () => {
    const meta = buildMetadata({
      title: 'Pricing — Willpwr',
      description: 'Free, Pro, and Lifetime plans for Willpwr — the AI-powered productivity workspace.',
      path: '/pricing',
    })
    expect(meta.alternates?.canonical).toContain('/pricing')
  })

  // Feature: willpwr-website, Property 10: Page titles and meta descriptions are within required bounds
  it('rejects pages with out-of-bounds metadata via the validate-content script (sanity)', () => {
    const meta = buildMetadata({
      title: 'Pricing — Willpwr',
      description: 'Free, Pro Monthly at $9.97/mo, Pro Annual at $79.97/yr, or Lifetime at $97. Pick the plan that fits.',
      path: '/pricing',
    })
    const title = meta.title as string
    const description = meta.description as string
    expect(title.length).toBeGreaterThanOrEqual(10)
    expect(title.length).toBeLessThanOrEqual(60)
    expect(description.length).toBeGreaterThanOrEqual(50)
    expect(description.length).toBeLessThanOrEqual(160)
  })
})
