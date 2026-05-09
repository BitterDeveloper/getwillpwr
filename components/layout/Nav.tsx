import Link from 'next/link'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { SIGNUP_URL } from '@/lib/site'

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <nav
        aria-label="Primary"
        className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
      >
        <Link href="/" aria-label="Willpwr home" className="flex items-center gap-2">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          <li>
            <Link href="/pricing" className="text-fg-muted hover:text-fg">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/help" className="text-fg-muted hover:text-fg">
              Help
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-fg-muted hover:text-fg">
              Contact
            </Link>
          </li>
        </ul>

        <div className="hidden md:block">
          <a
            href={SIGNUP_URL}
            className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Get Started
          </a>
        </div>

        <MobileMenu />
      </nav>
    </header>
  )
}
