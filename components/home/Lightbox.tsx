'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import type { Screenshot } from '@/types'

interface Props {
  shot: Screenshot
  onClose: () => void
}

export function Lightbox({ shot, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated text-fg"
      >
        ✕
      </button>
      <div
        className="relative max-h-[90vh] max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          className="h-auto w-full rounded-lg"
        />
        <p className="mt-3 text-center text-sm text-fg-muted">{shot.caption}</p>
      </div>
    </div>
  )
}
