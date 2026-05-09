import type { Metadata } from 'next'
import { CategoryList } from '@/components/help/CategoryList'
import { SearchBar } from '@/components/help/SearchBar'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Help Center — Willpwr',
  description:
    'Find answers to questions about getting started, account and billing, and using the Willpwr app day to day.',
  path: '/help',
})

export default function HelpIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-3 text-fg-muted">
          Search the docs or browse by category.
        </p>
      </header>
      <div className="mt-8">
        <SearchBar />
      </div>
      <div className="mt-16">
        <CategoryList />
      </div>
    </div>
  )
}
