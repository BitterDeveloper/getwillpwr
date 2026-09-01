export type PricingBillingType = 'free' | 'recurring' | 'one-time'

export interface PricingTier {
  id: string
  name: string
  /** Headline price in cents: the monthly rate for `recurring`/`free` tiers, the total for `one-time` tiers. */
  price: number
  annualPrice: number | null
  billingType: PricingBillingType
  features: string[]
  ctaLabel: string
  ctaHref: string
  isFeatured: boolean
  isFree: boolean
  freeTrialDays: number | null
  featureRestrictions: string[] | null
  badge: string | null
}

export interface PricingFaqEntry {
  question: string
  answer: string
}

export interface Screenshot {
  src: string
  alt: string
  caption: string
  width: number
  height: number
}

export type HelpArticleCategory =
  | 'getting-started'
  | 'account-billing'
  | 'using-the-app'

export interface HelpArticleFrontmatter {
  title: string
  category: HelpArticleCategory | string
  description: string
  order: number
  updatedAt: string
}

export interface HelpArticle {
  slug: string
  frontmatter: HelpArticleFrontmatter
  content: string
}

export type ConsentCategory = 'necessary' | 'analytics' | 'advertising'

export interface ConsentState {
  accepted: ConsentCategory[]
  rejected: ConsentCategory[]
  timestamp: number
  expiresAt: number
}

export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
  _hp: string
}

export type ContactResponse =
  | { success: true }
  | { success: false; error: string }
