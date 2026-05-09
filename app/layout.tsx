import type { Metadata, Viewport } from 'next'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/consent/CookieBanner'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'
import { baseMetadata } from '@/lib/metadata'
import './globals.css'

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: 'Willpwr — AI-powered productivity for deep work',
    template: '%s | Willpwr',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0b0e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-bg text-fg">
        <PostHogProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </PostHogProvider>
      </body>
    </html>
  )
}
