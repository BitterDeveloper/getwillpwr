import Link from 'next/link'
import { Logo } from './Logo'
import { SOCIAL_LINKS } from '@/lib/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-fg-muted">
              AI-powered productivity for people who want to do their best work.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Product
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-fg hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-fg hover:text-accent">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-fg hover:text-accent">
                  Help
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Company
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-fg hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-fg hover:text-accent">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-fg hover:text-accent">
                  Privacy
                </Link>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.twitter}
                  className="text-fg hover:text-accent"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-fg-muted sm:flex-row">
          <p>© {year} Willpwr. All rights reserved.</p>
          <p>Built for focus.</p>
        </div>
      </div>
    </footer>
  )
}
