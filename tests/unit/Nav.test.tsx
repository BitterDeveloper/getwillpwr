import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/layout/Nav'
import { SIGNUP_URL } from '@/lib/site'

describe('Nav', () => {
  // Feature: willpwr-website, Property 9: Nav contains all required links on every page
  it('renders home, pricing, help, and signup CTA', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'Willpwr home' })).toHaveAttribute('href', '/')
    // Two links named "Pricing" / "Help" exist (desktop + mobile collapse) — accept either
    expect(screen.getAllByRole('link', { name: /pricing/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /help/i }).length).toBeGreaterThan(0)
    const cta = screen.getByRole('link', { name: 'Get Started' })
    expect(cta).toHaveAttribute('href', SIGNUP_URL)
    expect(cta).not.toHaveAttribute('target', '_blank')
  })
})
