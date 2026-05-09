import Link from 'next/link'
import { getCategories } from '@/lib/help'

export function CategoryList() {
  const categories = getCategories()

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {categories.map((category) => (
        <section
          key={category.id}
          aria-labelledby={`cat-${category.id}`}
          className="rounded-lg border border-border bg-bg-elevated p-6"
        >
          <h2
            id={`cat-${category.id}`}
            className="text-lg font-semibold text-fg"
          >
            {category.label}
          </h2>
          <ul className="mt-4 space-y-2">
            {category.articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/help/${article.slug}`}
                  className="block text-sm text-fg-muted hover:text-accent"
                >
                  {article.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
