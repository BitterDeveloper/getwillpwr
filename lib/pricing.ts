export interface PricingAmount {
  price: number
  annualPrice: number | null
}

export interface AnnualSavings {
  savings: number
  perMonth: number
}

export function computeAnnualSavings(tier: PricingAmount): AnnualSavings {
  if (tier.annualPrice === null) {
    return { savings: 0, perMonth: 0 }
  }
  const savings = tier.price * 12 - tier.annualPrice
  const perMonth = Math.round(tier.annualPrice / 12)
  return { savings, perMonth }
}

export function formatCents(cents: number): string {
  const dollars = cents / 100
  return dollars % 1 === 0
    ? `$${dollars.toFixed(0)}`
    : `$${dollars.toFixed(2)}`
}

/** Annual discount, as months of the monthly rate the savings would buy. Floored, never overstated. */
export function computeMonthsFree(tier: PricingAmount): number {
  if (tier.annualPrice === null || tier.price === 0) return 0
  const { savings } = computeAnnualSavings(tier)
  return Math.floor((savings / tier.price) * 10) / 10
}

export function formatMonthsFree(tier: PricingAmount): string {
  const months = computeMonthsFree(tier)
  const label = Number.isInteger(months) ? months.toFixed(0) : months.toFixed(1)
  return `${label} months free`
}

export function computeSavingsPercent(tier: PricingAmount): number {
  if (tier.annualPrice === null || tier.price === 0) return 0
  const { savings } = computeAnnualSavings(tier)
  return (savings / (tier.price * 12)) * 100
}

export function formatSavingsPercent(tier: PricingAmount): string {
  return `${Math.round(computeSavingsPercent(tier))}%`
}
