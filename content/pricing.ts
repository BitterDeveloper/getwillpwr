import type { PricingTier, PricingFaqEntry } from '@/types'
import {
  computeAnnualSavings,
  formatCents,
  formatMonthsFree,
  formatSavingsPercent,
} from '@/lib/pricing'

const PRO_PRICE_CENTS = 997
const PRO_ANNUAL_PRICE_CENTS = 7997
const proAmount = { price: PRO_PRICE_CENTS, annualPrice: PRO_ANNUAL_PRICE_CENTS }
const proAnnualMonthsFree = formatMonthsFree(proAmount)
const proAnnualSavingsPercent = formatSavingsPercent(proAmount)
const proAnnualSavings = computeAnnualSavings(proAmount).savings

export const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    annualPrice: null,
    billingType: 'free',
    features: [
      'Dashboard overview',
      'Basic task management',
      'Calendar sync (Google & Microsoft)',
      'Limited AI messages (50/month)',
    ],
    ctaLabel: 'Get started free',
    ctaHref: 'https://willpwr.app/signup?plan=free',
    isFeatured: false,
    isFree: true,
    freeTrialDays: null,
    featureRestrictions: ['Limited to 50 AI messages/month'],
    badge: null,
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: PRO_PRICE_CENTS,
    annualPrice: null,
    billingType: 'recurring',
    features: [
      '350 AI assistant messages/month',
      'All productivity modules',
      'Email/Image — Gmail & Outlook',
      'Full dashboard customization',
      'SMS, Discord & email notifications',
      'Advanced analytics',
      '90-day planning with AI coaching',
      'Email support',
    ],
    ctaLabel: 'Start Pro Monthly',
    ctaHref: 'https://willpwr.app/signup?plan=pro-monthly',
    isFeatured: false,
    isFree: false,
    freeTrialDays: null,
    featureRestrictions: null,
    badge: null,
  },
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    price: PRO_PRICE_CENTS,
    annualPrice: PRO_ANNUAL_PRICE_CENTS,
    billingType: 'recurring',
    features: [
      'Everything in Pro Monthly',
      `${proAnnualMonthsFree} vs monthly billing`,
      'Priority email support',
    ],
    ctaLabel: 'Start Pro Annual',
    ctaHref: 'https://willpwr.app/signup?plan=pro-annual',
    isFeatured: true,
    isFree: false,
    freeTrialDays: null,
    featureRestrictions: null,
    badge: 'Best Value',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 9700,
    annualPrice: null,
    billingType: 'one-time',
    features: [
      '500 AI assistant messages/month',
      'All productivity modules',
      'Email/Image — Gmail & Outlook',
      'Full dashboard customization',
      'SMS, Discord & email notifications',
      'Advanced analytics',
      '90-day planning with AI coaching',
      'All future updates — no renewals',
    ],
    ctaLabel: 'Get Lifetime access',
    ctaHref: 'https://willpwr.app/signup?plan=lifetime',
    isFeatured: false,
    isFree: false,
    freeTrialDays: null,
    featureRestrictions: null,
    badge: null,
  },
]

export const pricingFaq: PricingFaqEntry[] = [
  {
    question: 'Can I really start for free?',
    answer:
      'Yes. Sign up and get instant access to the dashboard, task manager, and calendar sync at no cost. No credit card required.',
  },
  {
    question: 'What counts as an AI message?',
    answer:
      'Every time you send a message to the AI assistant or ask it to generate tasks, that uses one message. Viewing pages and loading data does not.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, cancel at any time from your account settings. You keep access until the end of your billing period.',
  },
  {
    question: "What's the difference between monthly and annual Pro?",
    answer:
      `Annual Pro is billed at ${formatCents(PRO_ANNUAL_PRICE_CENTS)}/yr — a ${proAnnualSavingsPercent} discount, roughly ${formatCents(proAnnualSavings)} savings vs paying ${formatCents(PRO_PRICE_CENTS)}/mo. That's ${proAnnualMonthsFree}.`,
  },
  {
    question: 'Is the Lifetime deal really one-time?',
    answer:
      'Yes. Pay once, use Willpwr forever — including all future updates and feature additions.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      "If you're unsatisfied within 14 days of your first payment, contact us and we'll sort it out.",
  },
]
