import Link from 'next/link'
import { SignupCta } from '@/components/ui/SignupCta'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
            Less app-switching. More deep work.
          </h1>
          <p className="mt-6 text-lg text-fg-muted sm:text-xl">
            All your tasks, email, calendar, and focus sessions in one place — with
            an AI assistant that helps you plan, focus, and stay on track.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <SignupCta label="Get started free" />
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-medium text-fg hover:bg-bg-elevated"
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
