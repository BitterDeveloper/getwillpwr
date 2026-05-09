import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArticleLayout } from '@/components/help/ArticleLayout'
import { getArticleBySlug, getArticles } from '@/lib/help'
import { buildMetadata } from '@/lib/metadata'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return buildMetadata({
    title: `${article.frontmatter.title} — Willpwr Help`,
    description: article.frontmatter.description,
    path: `/help/${article.slug}`,
  })
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()
  return (
    <ArticleLayout article={article}>
      <MDXRemote source={article.content} />
    </ArticleLayout>
  )
}
