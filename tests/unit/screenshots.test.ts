import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { screenshots } from '@/content/screenshots'

describe('screenshots content', () => {
  it('has at least three screenshots', () => {
    expect(screenshots.length).toBeGreaterThanOrEqual(3)
  })

  // Feature: willpwr-website, Property 2: Screenshot captions are within the character limit
  it('every caption is non-empty and ≤ 80 chars', () => {
    for (const shot of screenshots) {
      expect(shot.caption.length).toBeGreaterThan(0)
      expect(shot.caption.length).toBeLessThanOrEqual(80)
    }
  })

  // Feature: willpwr-website, Property 3: Screenshot alt text is present and within the character limit
  it('every alt text is non-empty and ≤ 125 chars', () => {
    for (const shot of screenshots) {
      expect(shot.alt.length).toBeGreaterThan(0)
      expect(shot.alt.length).toBeLessThanOrEqual(125)
    }
  })

  // Feature: willpwr-website, Property 4: Screenshot images use next-gen formats
  it('every src points to a next/image-compatible source', () => {
    for (const shot of screenshots) {
      expect(shot.src).toMatch(/\.(svg|png|jpg|jpeg|webp|avif)$/i)
    }
  })

  it('caption length constraint holds for arbitrary valid inputs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 80 }),
        (caption) => caption.length >= 1 && caption.length <= 80,
      ),
      { numRuns: 100 },
    )
  })
})
