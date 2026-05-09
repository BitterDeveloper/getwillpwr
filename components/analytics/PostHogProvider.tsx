'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    posthog?: import('posthog-js').PostHog
  }
}

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!POSTHOG_KEY) return

    const sync = async () => {
      const cc = await import('vanilla-cookieconsent').catch(() => null)
      const accepted = cc?.acceptedCategory?.('analytics') ?? false
      if (accepted && !initialized) {
        const { default: posthog } = await import('posthog-js')
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          capture_pageview: true,
          persistence: 'localStorage+cookie',
        })
        const utm = collectUtm()
        if (Object.keys(utm).length > 0) {
          posthog.register(utm)
        }
        setInitialized(true)
      } else if (!accepted && window.posthog) {
        window.posthog.opt_out_capturing()
      }
    }

    void sync()
    window.addEventListener('cc:consent-changed', sync)
    return () => window.removeEventListener('cc:consent-changed', sync)
  }, [initialized])

  return <>{children}</>
}

function collectUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const key of [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ]) {
    const value = params.get(key)
    if (value) out[key] = value
  }
  return out
}

export function trackSignupCtaClick(href: string): void {
  if (typeof window === 'undefined') return
  window.posthog?.capture('signup_cta_clicked', { href })
}
