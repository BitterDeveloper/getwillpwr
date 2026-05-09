'use client'

import { useEffect } from 'react'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const CONSENT_DAYS = 180

export function CookieBanner() {
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const cc = await import('vanilla-cookieconsent')
      if (cancelled) return
      cc.run({
        cookie: { expiresAfterDays: CONSENT_DAYS },
        guiOptions: {
          consentModal: { layout: 'box', position: 'bottom right' },
          preferencesModal: { layout: 'box' },
        },
        categories: {
          necessary: { enabled: true, readOnly: true },
          analytics: { enabled: false },
          advertising: { enabled: false },
        },
        onConsent: () => {
          window.dispatchEvent(new CustomEvent('cc:consent-changed'))
        },
        onChange: () => {
          window.dispatchEvent(new CustomEvent('cc:consent-changed'))
        },
        language: {
          default: 'en',
          translations: {
            en: {
              consentModal: {
                title: 'We use cookies',
                description:
                  'We use essential cookies to run the site, plus analytics cookies to understand how visitors use it. See our <a href="/privacy">Privacy Policy</a>.',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject non-essential',
                showPreferencesBtn: 'Customize',
              },
              preferencesModal: {
                title: 'Cookie preferences',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Reject non-essential',
                savePreferencesBtn: 'Save preferences',
                closeIconLabel: 'Close',
                sections: [
                  {
                    title: 'Strictly necessary',
                    description:
                      'These cookies are required for the site to function and cannot be disabled.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analytics',
                    description:
                      'Help us understand how visitors use the site so we can improve it.',
                    linkedCategory: 'analytics',
                  },
                  {
                    title: 'Advertising',
                    description:
                      'Used to deliver relevant ads. We do not currently load any advertising scripts.',
                    linkedCategory: 'advertising',
                  },
                  {
                    title: 'More information',
                    description:
                      'See our <a href="/privacy">Privacy Policy</a> or <a href="/contact">contact us</a> for questions.',
                  },
                ],
              },
            },
          },
        },
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
