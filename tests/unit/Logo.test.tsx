import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from '@/components/layout/Logo'

describe('Logo', () => {
  it('renders the mark with an empty alt so the link name stays "Willpwr home"', () => {
    render(<Logo />)
    // Empty alt makes the <img> presentational (removed from the accessibility tree),
    // so it must not surface an accessible "img" role that would double up the link name.
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    const img = screen.getByRole('presentation')
    expect(img).toHaveAttribute('alt', '')
  })

  it('renders the "Willpwr" wordmark as text', () => {
    render(<Logo />)
    expect(screen.getByText('Willpwr')).toBeInTheDocument()
  })
})
