// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { SUPPORT_EMAIL } from '@/lib/site'

// Stable across vi.resetModules(): the factory closes over these, so re-importing
// the route between tests gives us a fresh module-level rate-limit Map while the
// send spy stays the same object we assert on.
const { sendMock, resendCtor } = vi.hoisted(() => {
  const sendMock = vi.fn()
  const resendCtor = vi.fn(() => ({ emails: { send: sendMock } }))
  return { sendMock, resendCtor }
})

vi.mock('resend', () => ({ Resend: resendCtor }))

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Question about pricing',
  message: 'Hello, I have a question about the annual plan.',
  _hp: '',
}

/** Re-import the route so its module-level ipHits Map starts empty. */
async function loadRoute() {
  vi.resetModules()
  return (await import('@/app/api/contact/route')).POST
}

function post(body: unknown, ip = '203.0.113.10') {
  return new Request('https://getwillpwr.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  sendMock.mockReset()
  resendCtor.mockClear()
  sendMock.mockResolvedValue({ data: { id: 'msg_1' }, error: null })
  process.env.RESEND_API_KEY = 'test_key_not_a_real_credential'
  delete process.env.CONTACT_TO_EMAIL
  delete process.env.CONTACT_FROM_EMAIL
})

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
})

describe('POST /api/contact', () => {
  // Feature: willpwr-website, Property 19: Honeypot field blocks spam submissions
  it('rejects a filled honeypot with 400 and sends nothing', async () => {
    const POST = await loadRoute()
    const res = await POST(post({ ...VALID, _hp: 'buy-cheap-watches' }))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: 'Validation failed',
    })
    expect(sendMock).toHaveBeenCalledTimes(0)
  })

  it('sends exactly one email for a valid submission', async () => {
    const POST = await loadRoute()
    const res = await POST(post(VALID))

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
    expect(sendMock).toHaveBeenCalledTimes(1)

    const payload = sendMock.mock.calls[0][0]
    expect(payload.to).toBe(SUPPORT_EMAIL)
    // Pins the resend@4 camelCase spelling. The v3 SDK took `reply_to`; if an SDK
    // bump reverts it, the field is dropped silently and every support reply goes
    // nowhere. This assertion is the tripwire.
    expect(payload.replyTo).toBe(VALID.email)
    expect(payload).not.toHaveProperty('reply_to')
    expect(payload.from).toContain('noreply@getwillpwr.com')
    expect(payload.subject).toBe(`[Contact] ${VALID.subject}`)
    expect(payload.text).toContain(VALID.message)
  })

  it('honours CONTACT_TO_EMAIL over the lib/site default', async () => {
    process.env.CONTACT_TO_EMAIL = 'inbox@example.com'
    const POST = await loadRoute()
    const res = await POST(post(VALID))

    expect(res.status).toBe(200)
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock.mock.calls[0][0].to).toBe('inbox@example.com')
  })

  it('returns 500 when Resend resolves an error object', async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', message: 'Domain not verified' },
    })
    const POST = await loadRoute()
    const res = await POST(post(VALID))

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: 'Failed to send',
    })
    expect(sendMock).toHaveBeenCalledTimes(1)
  })

  it('returns 500 when the Resend call throws', async () => {
    sendMock.mockRejectedValue(new Error('ECONNRESET'))
    const POST = await loadRoute()
    const res = await POST(post(VALID))

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: 'Failed to send',
    })
  })

  it('returns 500 and sends nothing when RESEND_API_KEY is unset', async () => {
    delete process.env.RESEND_API_KEY
    const POST = await loadRoute()
    const res = await POST(post(VALID))

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: 'Email is not configured',
    })
    expect(sendMock).toHaveBeenCalledTimes(0)
  })

  it('returns 400 and sends nothing for a malformed JSON body', async () => {
    const POST = await loadRoute()
    const res = await POST(post('{"name": "Ada",'))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: 'Invalid JSON',
    })
    expect(sendMock).toHaveBeenCalledTimes(0)
  })

  it('rate limits the sixth request in a window from the same IP', async () => {
    const POST = await loadRoute()
    const ip = '198.51.100.7'

    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(post(VALID, ip))
      expect(ok.status).toBe(200)
    }
    expect(sendMock).toHaveBeenCalledTimes(5)

    const blocked = await POST(post(VALID, ip))
    expect(blocked.status).toBe(429)
    await expect(blocked.json()).resolves.toEqual({
      success: false,
      error: 'Too many requests',
    })
    expect(sendMock).toHaveBeenCalledTimes(5)
  })

  it('counts each x-forwarded-for client separately', async () => {
    const POST = await loadRoute()

    for (let i = 0; i < 5; i += 1) {
      await POST(post(VALID, '198.51.100.8'))
    }
    expect((await POST(post(VALID, '198.51.100.8'))).status).toBe(429)
    // A different client is unaffected by the first client's exhausted budget.
    expect((await POST(post(VALID, '198.51.100.9'))).status).toBe(200)
    expect(sendMock).toHaveBeenCalledTimes(6)
  })
})
