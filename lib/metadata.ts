import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    images: [
      {
        url: '/og-default.svg',
        width: 1200,
        height: 630,
        alt: 'Willpwr — AI-powered productivity for deep work.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

interface PageMetadataInput {
  title: string
  description: string
  path: string
  ogImage?: string
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
}: PageMetadataInput): Metadata {
  const canonical = new URL(path, SITE_URL).toString()
  const image = ogImage ?? '/og-default.svg'
  const absoluteImage = image.startsWith('http')
    ? image
    : new URL(image, SITE_URL).toString()

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        { url: absoluteImage, width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImage],
    },
  }
}
