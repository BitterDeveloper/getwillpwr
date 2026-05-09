import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { Screenshots } from '@/components/home/Screenshots'
import { Testimonials } from '@/components/home/Testimonials'
import { SecondaryCtaSection } from '@/components/home/SecondaryCtaSection'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Willpwr — AI-powered productivity for deep work',
  description:
    'All your tasks, email, calendar, and focus sessions in one place — with an AI assistant that helps you plan, focus, and stay on track.',
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <Screenshots />
      <SecondaryCtaSection />
    </>
  )
}
