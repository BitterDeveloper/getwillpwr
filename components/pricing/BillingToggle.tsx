'use client'

import { pricingTiers } from '@/content/pricing'
import { formatSavingsPercent } from '@/lib/pricing'

export type BillingCycle = 'monthly' | 'annual'

interface Props {
  value: BillingCycle
  onChange: (value: BillingCycle) => void
}

const annualTier = pricingTiers.find((tier) => tier.annualPrice !== null)
const savingsPercentLabel = annualTier ? formatSavingsPercent(annualTier) : null

export function BillingToggle({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing cycle"
      className="inline-flex rounded-md border border-border bg-bg-elevated p-1"
    >
      {(['monthly', 'annual'] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
            value === option
              ? 'bg-accent text-white'
              : 'text-fg-muted hover:text-fg'
          }`}
        >
          {option === 'monthly' ? 'Monthly' : 'Annual'}
          {option === 'annual' && savingsPercentLabel && (
            <span className="ml-2 rounded bg-success/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-success">
              Save {savingsPercentLabel}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
