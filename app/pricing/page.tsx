import type { Metadata } from 'next'
import { PricingGrid } from '@/components/pricing/PricingGrid'
import { PricingFaq } from '@/components/pricing/PricingFaq'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Pricing — Willpwr',
  description:
    'Free, Pro Monthly at $9.97/mo, Pro Annual at $79.97/yr (save 33%), or Lifetime at $97. Pick the plan that fits how you work.',
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
