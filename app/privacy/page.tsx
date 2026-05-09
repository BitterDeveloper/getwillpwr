import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { buildMetadata } from '@/lib/metadata'
import { readLegalDoc } from '@/lib/legal'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy — Willpwr',
  description:
    'How Willpwr collects, uses, retains, and protects your personal data, and your rights under GDPR and CCPA.',
  path: '/privacy',
})

export default function PrivacyPage() {
  const source = readLegalDoc('privacy')
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <article className="prose prose-invert max-w-none">
        <MDXRemote source={source} />
      </article>
    </div>
  )
}
