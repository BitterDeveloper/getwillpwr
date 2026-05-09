import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { HelpArticle, HelpArticleFrontmatter } from '@/types'

const HELP_DIR = path.join(process.cwd(), 'content', 'help')

export const CATEGORY_LABELS: Record<string, string> = {
  'getting-started': 'Getting started',
  'account-billing': 'Account & billing',
  'using-the-app': 'Using the app',
}

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    if (entry.isFile() && full.endsWith('.mdx')) return [full]
    return []
  })
}

export function getArticles(): HelpArticle[] {
  if (!fs.existsSync(HELP_DIR)) return []
  const files = walk(HELP_DIR)
  return files
    .map((file) => {
      const raw = fs.readFileSync(file, 'utf8')
      const { data, content } = matter(raw)
      const slug = path.basename(file, '.mdx')
      return {
        slug,
        frontmatter: data as HelpArticleFrontmatter,
        content,
      }
    })
    .sort((a, b) => {
      if (a.frontmatter.category !== b.frontmatter.category) {
        return a.frontmatter.category.localeCompare(b.frontmatter.category)
      }
      return a.frontmatter.order - b.frontmatter.order
    })
}

export function getArticleBySlug(slug: string): HelpArticle | null {
  return getArticles().find((a) => a.slug === slug) ?? null
}

export function getCategories(): { id: string; label: string; articles: HelpArticle[] }[] {
  const articles = getArticles()
  const byCategory = new Map<string, HelpArticle[]>()
  for (const article of articles) {
    const existing = byCategory.get(article.frontmatter.category) ?? []
    existing.push(article)
    byCategory.set(article.frontmatter.category, existing)
  }
  return [...byCategory.entries()].map(([id, items]) => ({
    id,
    label: CATEGORY_LABELS[id] ?? id,
    articles: items,
  }))
}
