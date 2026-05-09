import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PricingCard } from '@/components/pricing/PricingCard'
import { pricingTiers } from '@/content/pricing'

const tierById = (id: string) => {
  const tier = pricingTiers.find((t) => t.id === id)
  if (!tier) throw new Error(`No tier ${id}`)
  return tier
}

describe('PricingCard', () => {
  // Feature: willpwr-website, Property 5: Pricing tier config renders all required fields
  it('renders name, price, features, and CTA for every tier', () => {
    for (const tier of pricingTiers) {
      const { unmount } = render(<PricingCard tier={tier} billingCycle="monthly" />)
      expect(screen.getByRole('heading', { name: tier.name })).toBeInTheDocument()
      for (const feature of tier.features) {
        expect(screen.getByText(feature)).toBeInTheDocument()
      }
      const cta = screen.getByRole('link', { name: tier.ctaLabel })
      expect(cta).toHaveAttribute('href', tier.ctaHref)
      expect(cta).not.toHaveAttribute('target', '_blank')
      unmount()
    }
  })

  it('shows annual savings for Pro Annual when billingCycle=annual', () => {
    const tier = tierById('pro-annual')
    render(<PricingCard tier={tier} billingCycle="annual" />)
    expect(screen.getByText(/Save \$/)).toBeInTheDocument()
    expect(screen.getByText(/billed annually/i)).toBeInTheDocument()
  })

  it('renders Lifetime tier as one-time, not monthly', () => {
    const tier = tierById('lifetime')
    render(<PricingCard tier={tier} billingCycle="annual" />)
    expect(screen.getByText(/one-time/i)).toBeInTheDocument()
    expect(screen.getByText('$97')).toBeInTheDocument()
  })

  it('shows Free badge and feature restrictions for the Free tier', () => {
    const tier = tierById('free')
    render(<PricingCard tier={tier} billingCycle="monthly" />)
    // "Free" appears twice — heading + badge. Both are intentional.
    expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/restrictions/i)).toBeInTheDocument()
    expect(screen.getByText(/Limited to 50 AI messages/i)).toBeInTheDocument()
  })
})
