import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { buildMetadata } from '@/lib/metadata'
import { readLegalDoc } from '@/lib/legal'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service — Willpwr',
  description:
    'The legal agreement governing your use of the Willpwr website and application. Read the current Terms of Service.',
  path: '/terms',
})

export default function TermsPage() {
  const source = readLegalDoc('terms')
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <article className="prose prose-invert max-w-none">
        <MDXRemote source={source} />
      </article>
    </div>
  )
}
