import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Page not found — Willpwr',
  description:
    "The page you're looking for doesn't exist. Head back home or check the help center for what you need.",
  path: '/404',
})

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">
        404
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
        We can't find that page.
      </h1>
      <p className="mt-4 text-fg-muted">
        The link may be broken or the page may have moved. Try one of these:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Go home
        </Link>
        <Link
          href="/help"
          className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-fg hover:bg-bg-elevated"
        >
          Help center
        </Link>
      </div>
    </div>
  )
}
