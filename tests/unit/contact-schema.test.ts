import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { contactSchema } from '@/lib/contact-schema'

describe('contactSchema', () => {
  it('accepts a fully valid submission', () => {
    const result = contactSchema.safeParse({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Question',
      message: 'Hello, I have a question about pricing.',
      _hp: '',
    })
    expect(result.success).toBe(true)
  })

  // Feature: willpwr-website, Property 18: Contact form rejects invalid inputs with inline errors
  it('rejects invalid inputs (any field violation)', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({
            name: fc.string({ minLength: 101, maxLength: 200 }),
            email: fc.constant('a@b.co'),
            subject: fc.constant('valid'),
            message: fc.string({ minLength: 10, maxLength: 200 }),
            _hp: fc.constant(''),
          }),
          fc.record({
            name: fc.constant('Valid'),
            email: fc.string({ minLength: 1, maxLength: 5 }).filter((s) => !s.includes('@')),
            subject: fc.constant('valid'),
            message: fc.string({ minLength: 10, maxLength: 200 }),
            _hp: fc.constant(''),
          }),
          fc.record({
            name: fc.constant('Valid'),
            email: fc.constant('a@b.co'),
            subject: fc.string({ minLength: 151, maxLength: 200 }),
            message: fc.string({ minLength: 10, maxLength: 200 }),
            _hp: fc.constant(''),
          }),
          fc.record({
            name: fc.constant('Valid'),
            email: fc.constant('a@b.co'),
            subject: fc.constant('valid'),
            message: fc.string({ maxLength: 9 }),
            _hp: fc.constant(''),
          }),
        ),
        (input) => {
          const result = contactSchema.safeParse(input)
          expect(result.success).toBe(false)
        },
      ),
      { numRuns: 100 },
    )
  })

  // Feature: willpwr-website, Property 19: Honeypot field blocks spam submissions
  it('rejects submissions where the honeypot is non-empty', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (hp) => {
          const result = contactSchema.safeParse({
            name: 'Valid',
            email: 'a@b.co',
            subject: 'Valid',
            message: 'A long enough message here.',
            _hp: hp,
          })
          expect(result.success).toBe(false)
        },
      ),
      { numRuns: 100 },
    )
  })
})
