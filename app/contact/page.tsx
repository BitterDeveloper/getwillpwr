import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { buildMetadata } from '@/lib/metadata'
import { SUPPORT_EMAIL } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Willpwr — Support and sales inquiries',
  description:
    'Get in touch with the Willpwr team for support, billing questions, or sales inquiries. We reply within one business day.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Talk to us.
        </h1>
        <p className="mt-3 text-fg-muted">
          Hit us up about anything — bugs, billing, or feature ideas. Or email{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-accent hover:text-accent-hover"
          >
            {SUPPORT_EMAIL}
          </a>{' '}
          directly.
        </p>
      </header>
      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  )
}
