import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactForm } from '@/components/contact/ContactForm'

const validValues = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Question',
  message: 'Hello, this is a long enough test message.',
}

function fillForm() {
  fireEvent.input(screen.getByLabelText(/name/i), { target: { value: validValues.name } })
  fireEvent.input(screen.getByLabelText(/email/i), { target: { value: validValues.email } })
  fireEvent.input(screen.getByLabelText(/subject/i), { target: { value: validValues.subject } })
  fireEvent.input(screen.getByLabelText(/message/i), { target: { value: validValues.message } })
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('submits successfully and shows the confirmation message', async () => {
    render(<ContactForm />)
    fillForm()
    fireEvent.submit(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => expect(screen.getByText(/your message is in/i)).toBeInTheDocument())
  })

  it('shows inline validation errors for invalid input', async () => {
    render(<ContactForm />)
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } })
    fireEvent.input(screen.getByLabelText(/message/i), { target: { value: 'short' } })
    fireEvent.submit(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => {
      expect(screen.getAllByText(/email|String|10/i).length).toBeGreaterThan(0)
    })
  })

  it('shows a retry-friendly error when the API returns 500', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ error: 'Failed' }), { status: 500 })),
    )
    render(<ContactForm />)
    fillForm()
    fireEvent.submit(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })
})
