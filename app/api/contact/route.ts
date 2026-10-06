import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/contact-schema'
import { NOREPLY_EMAIL, SUPPORT_EMAIL } from '@/lib/site'

export const runtime = 'nodejs'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

// Deliberately in-memory and deliberately weak. `ipHits` lives in one serverless
// instance, and Vercel scales out and cold-starts freely, so the real guarantee is
// 5 requests per minute *per running instance*, not per site. It blunts a naive
// flood from a single client; it does not stop a determined one. The honeypot
// (`_hp` in contactSchema) is the actual spam gate. Making this a site-wide limit
// means adding a shared datastore (Upstash/KV), which is a hosting decision nobody
// has made yet -- do not add one without asking.
const ipHits = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipHits.get(ip)
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count += 1
  return true
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 },
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Validation failed' },
      { status: 400 },
    )
  }

  const { name, email, subject, message } = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'Email is not configured' },
      { status: 500 },
    )
  }

  const resend = new Resend(apiKey)
  const to = process.env.CONTACT_TO_EMAIL ?? SUPPORT_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL ?? NOREPLY_EMAIL

  try {
    const { error } = await resend.emails.send({
      from: `Willpwr Contact <${from}>`,
      to,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    })
    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to send' },
        { status: 500 },
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to send' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
