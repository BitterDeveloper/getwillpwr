'use client'

import { useState } from 'react'
import Image from 'next/image'
import { screenshots } from '@/content/screenshots'
import type { Screenshot } from '@/types'
import { Lightbox } from './Lightbox'

export function Screenshots() {
  const [active, setActive] = useState<Screenshot | null>(null)

  return (
    <section className="border-b border-border bg-bg-elevated">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          See it in action.
        </h2>
        <p className="mt-3 max-w-2xl text-fg-muted">
          A peek at the dashboard, AI assistant, and focus session views.
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {screenshots.map((shot) => (
            <li key={shot.src}>
              <button
                type="button"
                onClick={() => setActive(shot)}
                className="group block w-full overflow-hidden rounded-lg border border-border bg-bg text-left lg:cursor-zoom-in"
                aria-label={`Open ${shot.caption} in a larger view`}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full"
                />
                <p className="px-4 py-3 text-sm text-fg-muted">{shot.caption}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {active && <Lightbox shot={active} onClose={() => setActive(null)} />}
    </section>
  )
}
