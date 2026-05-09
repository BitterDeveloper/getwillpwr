import { describe, it, expect } from 'vitest'
import { getArticles, getCategories } from '@/lib/help'

describe('help center content', () => {
  it('loads at least three articles', () => {
    expect(getArticles().length).toBeGreaterThanOrEqual(3)
  })

  it('groups articles into at least three categories', () => {
    expect(getCategories().length).toBeGreaterThanOrEqual(3)
  })

  it('every article has the required frontmatter fields', () => {
    for (const article of getArticles()) {
      expect(article.frontmatter.title).toBeTruthy()
      expect(article.frontmatter.category).toBeTruthy()
      expect(article.frontmatter.description.length).toBeGreaterThanOrEqual(50)
      expect(article.frontmatter.description.length).toBeLessThanOrEqual(160)
      expect(typeof article.frontmatter.order).toBe('number')
      expect(article.frontmatter.updatedAt).toBeTruthy()
    }
  })

  it('every article slug is unique', () => {
    const slugs = getArticles().map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
