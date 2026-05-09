import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { computeAnnualSavings, formatCents } from '@/lib/pricing'
import { pricingTiers, pricingFaq } from '@/content/pricing'
import type { PricingTier } from '@/types'

function makeTier(overrides: Partial<PricingTier>): PricingTier {
  return {
    id: 'test',
    name: 'Test',
    monthlyPrice: 0,
    annualPrice: null,
    features: [],
    ctaLabel: 'go',
    ctaHref: 'https://willpwr.app/signup',
    isFeatured: false,
    isFree: false,
    freeTrialDays: null,
    featureRestrictions: null,
    badge: null,
    ...overrides,
  }
}

describe('pricing config', () => {
  it('has at least one tier and at least five FAQ entries', () => {
    expect(pricingTiers.length).toBeGreaterThanOrEqual(1)
    expect(pricingFaq.length).toBeGreaterThanOrEqual(5)
  })

  it('every tier has all required fields', () => {
    for (const tier of pricingTiers) {
      expect(tier.id).toBeTruthy()
      expect(tier.name).toBeTruthy()
      expect(tier.ctaLabel).toBeTruthy()
      expect(tier.ctaHref).toMatch(/^https:\/\/willpwr\.app\/signup/)
      expect(Array.isArray(tier.features)).toBe(true)
    }
  })
})

describe('computeAnnualSavings', () => {
  // Feature: willpwr-website, Property 6: Annual savings calculation is correct
  it('annual savings calculation is correct for any tier with annual pricing', () => {
    fc.assert(
      fc.property(
        fc.record({
          monthlyPrice: fc.integer({ min: 100, max: 100_000 }),
          annualPrice: fc.integer({ min: 100, max: 1_000_000 }),
        }),
        ({ monthlyPrice, annualPrice }) => {
          const tier = makeTier({ monthlyPrice, annualPrice })
          const { savings, perMonth } = computeAnnualSavings(tier)
          expect(savings).toBe(monthlyPrice * 12 - annualPrice)
          expect(perMonth).toBe(Math.round(annualPrice / 12))
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns zeros when annualPrice is null', () => {
    const tier = makeTier({ monthlyPrice: 997, annualPrice: null })
    expect(computeAnnualSavings(tier)).toEqual({ savings: 0, perMonth: 0 })
  })
})

describe('formatCents', () => {
  it('formats whole dollars without trailing zeros', () => {
    expect(formatCents(9700)).toBe('$97')
  })

  it('formats sub-dollar prices with two decimals', () => {
    expect(formatCents(997)).toBe('$9.97')
    expect(formatCents(7997)).toBe('$79.97')
  })
})
