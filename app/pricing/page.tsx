import type { Metadata } from 'next'
import { PricingGrid } from '@/components/pricing/PricingGrid'
import { PricingFaq } from '@/components/pricing/PricingFaq'
import { buildMetadata } from '@/lib/metadata'
import { pricingTiers } from '@/content/pricing'
import { formatCents, formatSavingsPercent } from '@/lib/pricing'

function buildPricingDescription(): string {
  const monthly = pricingTiers.find((tier) => tier.id === 'pro-monthly')
  const annual = pricingTiers.find((tier) => tier.annualPrice !== null)
  const lifetime = pricingTiers.find((tier) => tier.billingType === 'one-time')
  if (!monthly || !annual || !annual.annualPrice || !lifetime) {
    throw new Error('Pricing metadata description requires monthly, annual, and lifetime tiers')
  }
  const savingsPercent = formatSavingsPercent(annual)
  return `Free, Pro Monthly at ${formatCents(monthly.price)}/mo, Pro Annual at ${formatCents(annual.annualPrice)}/yr (save ${savingsPercent}), or Lifetime at ${formatCents(lifetime.price)}. Pick the plan that fits how you work.`
}

export const metadata: Metadata = buildMetadata({
  title: 'Pricing — Willpwr',
  description: buildPricingDescription(),
  path: '/pricing',
})

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Simple, honest pricing.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-fg-muted">
          Start free. Upgrade when you need more. Cancel anytime.
        </p>
      </header>
      <div className="mt-16">
        <PricingGrid />
      </div>
      <PricingFaq />
    </div>
  )
}
