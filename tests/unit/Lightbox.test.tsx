import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Lightbox } from '@/components/home/Lightbox'

const shot = {
  src: '/screenshots/dashboard.svg',
  alt: 'Dashboard',
  caption: 'Dashboard caption',
  width: 1600,
  height: 1000,
}

describe('Lightbox', () => {
  it('closes when the Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<Lightbox shot={shot} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes when the close button is clicked', () => {
    const onClose = vi.fn()
    render(<Lightbox shot={shot} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes when the backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<Lightbox shot={shot} onClose={onClose} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
