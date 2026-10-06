'use client'

import { trackSignupCtaClick } from '@/components/analytics/PostHogProvider'
import { computeAnnualSavings, formatCents } from '@/lib/pricing'
import type { PricingTier } from '@/types'
import type { BillingCycle } from './BillingToggle'

interface Props {
  tier: PricingTier
  billingCycle: BillingCycle
}

export function PricingCard({ tier, billingCycle }: Props) {
  const isOneTime = tier.billingType === 'one-time'
  const isAnnualView =
    billingCycle === 'annual' && tier.annualPrice !== null && !isOneTime
  const isMonthlyOnlyInAnnualView =
    billingCycle === 'annual' && tier.billingType === 'recurring' && tier.annualPrice === null

  const priceDisplay = (() => {
    if (tier.isFree) return { primary: formatCents(0), suffix: 'forever' }
    if (isOneTime) return { primary: formatCents(tier.price), suffix: 'one-time' }
    if (isAnnualView) {
      const { perMonth } = computeAnnualSavings(tier)
      return {
        primary: `${formatCents(perMonth)}`,
        suffix: '/mo, billed annually',
      }
    }
    if (isMonthlyOnlyInAnnualView) {
      return { primary: formatCents(tier.price), suffix: '/month, billed monthly' }
    }
    return { primary: formatCents(tier.price), suffix: '/month' }
  })()

  const savings =
    isAnnualView && tier.annualPrice !== null
      ? computeAnnualSavings(tier).savings
      : null

  return (
    <article
      className={`relative flex h-full flex-col rounded-lg border bg-bg p-6 ${
        tier.isFeatured ? 'border-accent' : 'border-border'
      }`}
    >
      {tier.badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
          {tier.badge}
        </span>
      )}
      <header>
        <h3 className="text-lg font-semibold text-fg">{tier.name}</h3>
        {tier.isFree && (
          <span className="mt-1 inline-block rounded bg-success/20 px-2 py-0.5 text-xs font-semibold uppercase text-success">
            Free
          </span>
        )}
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-semibold text-fg">
            {priceDisplay.primary}
          </span>
          <span className="text-sm text-fg-muted">{priceDisplay.suffix}</span>
        </div>
        {savings !== null && savings > 0 && (
          <p className="mt-1 text-xs text-success">
            Save {formatCents(savings)}/yr vs monthly
          </p>
        )}
      </header>

      <ul className="mt-6 flex-1 space-y-2 text-sm text-fg">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span aria-hidden className="text-accent">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {tier.featureRestrictions && tier.featureRestrictions.length > 0 && (
        <div className="mt-4 rounded-md border border-border bg-bg-elevated p-3 text-xs text-fg-muted">
          <p className="font-semibold uppercase tracking-wider">Restrictions</p>
          <ul className="mt-1 space-y-1">
            {tier.featureRestrictions.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={tier.ctaHref}
        onClick={() => trackSignupCtaClick(tier.ctaHref)}
        className={`mt-6 inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium ${
          tier.isFeatured
            ? 'bg-accent text-white hover:bg-accent-hover'
            : 'border border-border text-fg hover:bg-bg-elevated'
        }`}
      >
        {tier.ctaLabel}
      </a>
    </article>
  )
}
