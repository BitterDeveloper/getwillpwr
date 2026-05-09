import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/home/Hero'
import { SIGNUP_URL } from '@/lib/site'

describe('Hero', () => {
  // Feature: willpwr-website, Property 1: Signup CTA links target willpwr.app/signup
  it('primary CTA targets willpwr.app/signup in the same tab', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: /get started free/i })
    expect(cta).toHaveAttribute('href', SIGNUP_URL)
    expect(cta).not.toHaveAttribute('target', '_blank')
  })

  it('secondary CTA links to /pricing', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: /see pricing/i })
    expect(cta).toHaveAttribute('href', '/pricing')
  })

  it('renders the headline and sub-headline', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /less app-switching/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/AI assistant that helps you plan, focus/i)).toBeInTheDocument()
  })
})
