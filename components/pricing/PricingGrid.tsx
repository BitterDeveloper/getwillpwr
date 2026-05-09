'use client'

import { useState } from 'react'
import { pricingTiers } from '@/content/pricing'
import { BillingToggle, type BillingCycle } from './BillingToggle'
import { PricingCard } from './PricingCard'

export function PricingGrid() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly')

  return (
    <div>
      <div className="flex justify-center">
        <BillingToggle value={cycle} onChange={setCycle} />
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} billingCycle={cycle} />
        ))}
      </div>
    </div>
  )
}
