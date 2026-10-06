# getwillpwr

Website for getwillpwr.com — the marketing and product site for Willpwr. Next.js 15 App Router, deployed on Vercel. The app itself lives at `willpwr.app` in a separate repo.

## Commands

```bash
npm run dev         # local dev server
npm run typecheck   # tsc --noEmit
npm run test        # vitest (unit + property tests)
npm run test:e2e    # playwright
npm run build       # next build + pagefind index
```

## Environment variables

All of these are set in the Vercel project for **Production** and **Preview**. `.env.example` lists them with safe placeholder values; copy it to `.env.local` for local work. `.env.local` is gitignored and stays that way.

| Variable | What it does |
|---|---|
| `RESEND_API_KEY` | Server-side credential for the Resend API. `app/api/contact/route.ts` reads it per request and returns 500 if it is missing, so the contact form fails loudly rather than pretending to send. |
| `CONTACT_TO_EMAIL` | Where contact-form submissions are delivered. Falls back to `SUPPORT_EMAIL` in `lib/site.ts`. |
| `CONTACT_FROM_EMAIL` | The envelope sender. Must be an address on a domain verified in Resend, or the send is rejected. Falls back to `NOREPLY_EMAIL` in `lib/site.ts`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for metadata, OG tags, and the sitemap. |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key. Analytics stay off until the visitor consents. |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog ingest host (EU cloud). |

**`RESEND_API_KEY` is never committed and never written to a file in this repo.** It is a server-only secret: it has no `NEXT_PUBLIC_` prefix, so Next.js will not inline it into client bundles. Set it in the Vercel dashboard; for local testing put it in `.env.local` only.

The addresses `support@getwillpwr.com`, `sales@getwillpwr.com`, and `noreply@getwillpwr.com` are defined once in `lib/site.ts`. Change them there, not in the route handler.

## Contact form and rate limiting

`POST /api/contact` validates with zod (`lib/contact-schema.ts`), rejects any submission with a non-empty `_hp` honeypot field, and hands the rest to Resend with `replyTo` set to the visitor's address. `tests/unit/contact-route.test.ts` mocks the Resend SDK and asserts the send call count, so a rejected submission is proven not to deliver mail.

The per-IP rate limiter is an in-memory `Map` inside a serverless function. Vercel runs multiple instances and cold-starts them freely, so the real guarantee is **5 requests per minute per instance, not per site**. It stops a naive flood from one client and nothing more. The honeypot is the actual spam gate. Making the limit site-wide requires a shared datastore (Upstash, Vercel KV) — that is new infrastructure and an open decision, not a code change to make casually.

## Sending domain

Resend sends mail; it does not receive it. `support@` and `sales@` need a real inbound mailbox at a mail host with its own MX records — verifying the domain in Resend does not create one. Until that exists, contact-form mail has nowhere to land.
