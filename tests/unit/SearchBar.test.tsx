import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SearchBar } from '@/components/help/SearchBar'

describe('SearchBar', () => {
  it('shows an "unavailable" message when the Pagefind index fails to load', async () => {
    render(<SearchBar />)
    await waitFor(
      () => expect(screen.getByText(/search unavailable/i)).toBeInTheDocument(),
      { timeout: 6500 },
    )
  })

  it('renders the search input and submit button', () => {
    render(<SearchBar />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })
})
