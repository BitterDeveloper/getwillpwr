import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { screenshots } from '../content/screenshots'
import { pricingTiers, pricingFaq } from '../content/pricing'

interface Violation {
  source: string
  message: string
}

const violations: Violation[] = []

function check(condition: boolean, source: string, message: string): void {
  if (!condition) violations.push({ source, message })
}

// Screenshots
for (const shot of screenshots) {
  const id = `screenshot:${shot.src}`
  check(shot.src.length > 0, id, 'src must be non-empty')
  check(shot.alt.length > 0 && shot.alt.length <= 125, id, 'alt must be 1–125 chars')
  check(
    shot.caption.length > 0 && shot.caption.length <= 80,
    id,
    'caption must be 1–80 chars',
  )
  check(shot.width > 0 && shot.height > 0, id, 'width and height must be positive')
}

// Pricing
check(pricingTiers.length >= 1, 'pricing', 'at least one tier required')
check(pricingFaq.length >= 5, 'pricing', 'at least five FAQ entries required')

// Help articles
const helpDir = path.join(process.cwd(), 'content', 'help')
function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.isFile() && full.endsWith('.mdx') ? [full] : []
  })
}

const helpFiles = walk(helpDir)
check(helpFiles.length >= 3, 'help', 'at least three help articles required')

const seenSlugs = new Set<string>()
for (const file of helpFiles) {
  const slug = path.basename(file, '.mdx')
  const id = `help:${slug}`
  check(!seenSlugs.has(slug), id, 'duplicate slug')
  seenSlugs.add(slug)

  const { data } = matter(fs.readFileSync(file, 'utf8'))
  const required = ['title', 'category', 'description', 'order', 'updatedAt']
  for (const key of required) {
    check(key in data, id, `missing frontmatter field: ${key}`)
  }
  if (typeof data.description === 'string') {
    check(
      data.description.length >= 50 && data.description.length <= 160,
      id,
      'description must be 50–160 chars',
    )
  }
}

// Page metadata — basic title/description bounds (sourced from page files via grep)
const pageFiles = [
  'app/page.tsx',
  'app/pricing/page.tsx',
  'app/help/page.tsx',
  'app/terms/page.tsx',
  'app/privacy/page.tsx',
  'app/contact/page.tsx',
  'app/not-found.tsx',
]
const seenTitles = new Set<string>()
for (const rel of pageFiles) {
  const full = path.join(process.cwd(), rel)
  if (!fs.existsSync(full)) continue
  const src = fs.readFileSync(full, 'utf8')
  const titleMatch = src.match(/title:\s*'([^']+)'/)
  const descMatch = src.match(/description:\s*'([^']+)'/) ?? src.match(/description:\s*\n\s*'([^']+)'/)
  if (titleMatch) {
    const title = titleMatch[1]
    check(
      title.length >= 10 && title.length <= 60,
      `metadata:${rel}`,
      `title length ${title.length} not in 10–60`,
    )
    check(!seenTitles.has(title), `metadata:${rel}`, `duplicate title: ${title}`)
    seenTitles.add(title)
  }
  if (descMatch) {
    const desc = descMatch[1]
    check(
      desc.length >= 50 && desc.length <= 160,
      `metadata:${rel}`,
      `description length ${desc.length} not in 50–160`,
    )
  }
}

if (violations.length > 0) {
  console.error('[validate-content] Failed:')
  for (const v of violations) {
    console.error(`  ${v.source}: ${v.message}`)
  }
  process.exit(1)
}

console.log(`[validate-content] OK (${helpFiles.length} articles, ${pricingTiers.length} tiers, ${screenshots.length} screenshots)`)
