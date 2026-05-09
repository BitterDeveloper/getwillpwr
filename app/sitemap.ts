import type { MetadataRoute } from 'next'
import { getArticles } from '@/lib/help'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = ['/', '/pricing', '/help', '/terms', '/privacy', '/contact']

  const helpArticles = getArticles().map((article) => ({
    url: new URL(`/help/${article.slug}`, SITE_URL).toString(),
    lastModified: new Date(article.frontmatter.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes.map((path) => ({
      url: new URL(path, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...helpArticles,
  ]
}
