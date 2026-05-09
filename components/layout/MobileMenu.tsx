'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SIGNUP_URL } from '@/lib/site'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-fg"
      >
        <span aria-hidden>{open ? '✕' : '☰'}</span>
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full mt-2 border-t border-border bg-bg-elevated px-4 py-4"
        >
          <ul className="flex flex-col gap-3 text-base">
            <li>
              <Link href="/pricing" onClick={() => setOpen(false)} className="block py-2">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/help" onClick={() => setOpen(false)} className="block py-2">
                Help
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setOpen(false)} className="block py-2">
                Contact
              </Link>
            </li>
            <li>
              <a
                href={SIGNUP_URL}
                className="block rounded-md bg-accent px-4 py-2 text-center font-medium text-white"
              >
                Get Started
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
