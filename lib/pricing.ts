import type { PricingTier } from '@/types'

export interface AnnualSavings {
  savings: number
  perMonth: number
}

export function computeAnnualSavings(tier: PricingTier): AnnualSavings {
  if (tier.annualPrice === null) {
    return { savings: 0, perMonth: 0 }
  }
  const savings = tier.monthlyPrice * 12 - tier.annualPrice
  const perMonth = Math.round(tier.annualPrice / 12)
  return { savings, perMonth }
}

export function formatCents(cents: number): string {
  const dollars = cents / 100
  return dollars % 1 === 0
    ? `$${dollars.toFixed(0)}`
    : `$${dollars.toFixed(2)}`
}
