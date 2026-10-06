import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  computeAnnualSavings,
  computeMonthsFree,
  computeSavingsPercent,
  formatCents,
} from '@/lib/pricing'
import { pricingTiers, pricingFaq } from '@/content/pricing'
import type { PricingTier } from '@/types'

function makeTier(overrides: Partial<PricingTier>): PricingTier {
  return {
    id: 'test',
    name: 'Test',
    price: 0,
    annualPrice: null,
    billingType: 'recurring',
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
          price: fc.integer({ min: 100, max: 100_000 }),
          annualPrice: fc.integer({ min: 100, max: 1_000_000 }),
        }),
        ({ price, annualPrice }) => {
          const tier = makeTier({ price, annualPrice })
          const { savings, perMonth } = computeAnnualSavings(tier)
          expect(savings).toBe(price * 12 - annualPrice)
          expect(perMonth).toBe(Math.round(annualPrice / 12))
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns zeros when annualPrice is null', () => {
    const tier = makeTier({ price: 997, annualPrice: null })
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

// Invariant (a): a tier's stated AI-message quota must never be lower than a
// strictly cheaper tier's — otherwise the "better" plan advertises less than
// what it's meant to beat. Cheapness is compared on an effective
// monthly-equivalent basis; one-time tiers are excluded since they have no
// monthly cost basis to compare against.
describe('AI-message quota invariant', () => {
  function quotaFor(tier: PricingTier): number | null {
    for (const feature of tier.features) {
      const match = feature.match(/(\d+)\s+AI assistant messages\/month/i)
      if (match) return Number(match[1])
    }
    return null
  }

  function effectiveMonthlyCost(tier: PricingTier): number | null {
    if (tier.isFree) return 0
    if (tier.billingType === 'one-time') return null
    return tier.annualPrice !== null ? tier.annualPrice / 12 : tier.price
  }

  it('no tier promises fewer AI messages/month than any strictly cheaper tier', () => {
    for (const pricier of pricingTiers) {
      const pricierCost = effectiveMonthlyCost(pricier)
      const pricierQuota = quotaFor(pricier)
      if (pricierCost === null || pricierQuota === null) continue

      for (const cheaper of pricingTiers) {
        if (cheaper.id === pricier.id) continue
        const cheaperCost = effectiveMonthlyCost(cheaper)
        const cheaperQuota = quotaFor(cheaper)
        if (cheaperCost === null || cheaperQuota === null) continue

        if (cheaperCost < pricierCost) {
          expect(cheaperQuota).toBeGreaterThanOrEqual(pricierQuota)
        }
      }
    }
  })
})

// Invariant (b): pricing math (dollar amounts, savings percentages) must live
// only in content/pricing.ts. Anywhere else, it's a copy that will silently
// go stale the next time a price changes in Stripe.
describe('no hardcoded pricing math outside content/pricing.ts', () => {
  const PRICING_SOURCE_OF_TRUTH = path.join('content', 'pricing.ts')

  function walk(dir: string): string[] {
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return walk(full)
      return entry.isFile() && /\.(ts|tsx)$/.test(entry.name) ? [full] : []
    })
  }

  const scanFiles = ['app', 'components', 'content']
    .flatMap((dir) => walk(path.join(process.cwd(), dir)))
    .filter((file) => path.relative(process.cwd(), file) !== PRICING_SOURCE_OF_TRUTH)

  it('contains no literal dollar amounts', () => {
    const offenders = scanFiles.filter((file) => /\$\d/.test(fs.readFileSync(file, 'utf8')))
    expect(offenders.map((f) => path.relative(process.cwd(), f))).toEqual([])
  })

  it('contains no literal savings percentages in pricing UI', () => {
    // Scoped to the pricing surface: percentages elsewhere (e.g. testimonial
    // stats) aren't pricing math and shouldn't be forced through pricing.ts.
    const pricingUiFiles = scanFiles.filter((file) =>
      /[\\/](components|app)[\\/]pricing[\\/]/.test(file),
    )
    const offenders = pricingUiFiles.filter((file) => /\b\d{1,3}%/.test(fs.readFileSync(file, 'utf8')))
    expect(offenders.map((f) => path.relative(process.cwd(), f))).toEqual([])
  })
})

// Invariant (c): every "months free" or "% discount" claim made in tier
// features or FAQ copy must equal the value computed from price/annualPrice —
// nobody should be able to type a savings number that arithmetic disagrees with.
describe('derived savings claims match computed values', () => {
  const annualTier = pricingTiers.find((tier) => tier.annualPrice !== null)

  it('an annual tier exists to check claims against', () => {
    expect(annualTier).toBeDefined()
  })

  it('every "months free" claim in tier features matches the computed value', () => {
    for (const tier of pricingTiers) {
      for (const feature of tier.features) {
        const match = feature.match(/([\d.]+)\s+months free/i)
        if (!match) continue
        expect(Number(match[1])).toBeCloseTo(computeMonthsFree(tier), 5)
      }
    }
  })

  it('every months-free or percent-discount claim in FAQ answers matches the computed value', () => {
    for (const entry of pricingFaq) {
      const monthsMatch = entry.answer.match(/([\d.]+)\s+months free/i)
      if (monthsMatch) {
        expect(annualTier).toBeDefined()
        expect(Number(monthsMatch[1])).toBeCloseTo(computeMonthsFree(annualTier!), 5)
      }
      const percentMatch = entry.answer.match(/(\d+)%\s+discount/i)
      if (percentMatch) {
        expect(annualTier).toBeDefined()
        expect(Number(percentMatch[1])).toBe(Math.round(computeSavingsPercent(annualTier!)))
      }
    }
  })
})
