import type { PricingTier, PricingFaqEntry } from '@/types'

export const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: null,
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
    monthlyPrice: 997,
    annualPrice: null,
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
    monthlyPrice: 997,
    annualPrice: 7997,
    features: [
      'Everything in Pro Monthly',
      '3 months free vs monthly billing',
      'Priority email support',
      '250 AI assistant messages/month',
      'Email/Image — Gmail & Outlook',
      'Full dashboard customization',
      'SMS, Discord & email notifications',
      'Advanced analytics',
      '90-day planning with AI coaching',
      'Email support',
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
    monthlyPrice: 9700,
    annualPrice: null,
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
      "Annual Pro is billed at $79.97/yr — a 33% discount, roughly $40 savings vs paying $9.97/mo. That's two months free.",
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
