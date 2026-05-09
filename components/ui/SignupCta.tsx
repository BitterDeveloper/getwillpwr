'use client'

import { trackSignupCtaClick } from '@/components/analytics/PostHogProvider'
import { SIGNUP_URL } from '@/lib/site'

interface Props {
  label: string
  href?: string
  variant?: 'primary' | 'secondary'
  className?: string
}

export function SignupCta({
  label,
  href = SIGNUP_URL,
  variant = 'primary',
  className = '',
}: Props) {
  const base =
    'inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors'
  const styles =
    variant === 'primary'
      ? 'bg-accent text-white hover:bg-accent-hover'
      : 'border border-border text-fg hover:bg-bg-elevated'

  return (
    <a
      href={href}
      onClick={() => trackSignupCtaClick(href)}
      className={`${base} ${styles} ${className}`}
    >
      {label}
    </a>
  )
}
