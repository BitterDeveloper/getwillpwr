import Link from 'next/link'
import type { ReactNode } from 'react'
import type { HelpArticle } from '@/types'
import { CATEGORY_LABELS } from '@/lib/help'

interface Props {
  article: HelpArticle
  children: ReactNode
}

export function ArticleLayout({ article, children }: Props) {
  const categoryLabel =
    CATEGORY_LABELS[article.frontmatter.category] ?? article.frontmatter.category

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <nav className="mb-6 text-sm text-fg-muted">
        <Link href="/help" className="hover:text-accent">
          Help
        </Link>{' '}
        / {categoryLabel}
      </nav>
      <div className="prose prose-invert max-w-none">{children}</div>
      <hr className="my-12 border-border" />
      <div className="rounded-lg border border-border bg-bg-elevated p-6">
        <h2 className="text-base font-semibold text-fg">Still need help?</h2>
        <p className="mt-2 text-sm text-fg-muted">
          We're happy to help. Reach the team and we'll get back within one business day.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Contact Support
        </Link>
      </div>
    </article>
  )
}
