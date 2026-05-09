'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/lib/contact-schema'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { _hp: '' },
  })

  const onSubmit = async (values: ContactInput) => {
    setStatus('submitting')
    setErrorMsg(null)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10_000)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null
        const message =
          res.status === 429
            ? 'Too many requests — please wait before trying again.'
            : body?.error ?? 'Something went wrong — please try again.'
        setErrorMsg(message)
        setStatus('error')
        return
      }
      reset()
      setStatus('success')
    } catch {
      setErrorMsg('Network error — please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-lg border border-success/40 bg-success/10 p-6 text-fg"
      >
        <p className="font-medium">Thanks — your message is in.</p>
        <p className="mt-2 text-sm text-fg-muted">
          We'll reply within one business day. If it's urgent, mention that in
          the subject and we'll prioritize.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Contact support"
    >
      <Field
        id="name"
        label="Name"
        autoComplete="name"
        register={register('name')}
        error={errors.name?.message}
      />
      <Field
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        register={register('email')}
        error={errors.email?.message}
      />
      <Field
        id="subject"
        label="Subject"
        register={register('subject')}
        error={errors.subject?.message}
      />
      <div>
        <label htmlFor="message" className="mb-1 block text-sm text-fg">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
          className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-fg"
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-xs text-danger">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from real users, visible to dumb bots */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}
      >
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('_hp')}
        />
      </div>

      {errorMsg && (
        <div role="alert" className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

interface FieldProps {
  id: string
  label: string
  type?: string
  autoComplete?: string
  register: ReturnType<ReturnType<typeof useForm<ContactInput>>['register']>
  error?: string
}

function Field({ id, label, type = 'text', autoComplete, register, error }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm text-fg">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...register}
        className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-fg"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
