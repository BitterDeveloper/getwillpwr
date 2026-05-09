# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Greenfield. The repo currently contains only a README and a requirements spec — no source code, no package manifest, no build/test/lint tooling. Any of these decisions (framework, hosting, package manager, test runner) are still open and should be made explicitly with the user before scaffolding.

## What this project is

`getwillpwr.com` — the public marketing/product website for **Willpwr**, a virtual assistant and coaching app. Two domains are in play and easy to confuse:

- **getwillpwr.com** — this repo. Marketing site, pricing, help center, legal pages, contact. Conversion-focused; the primary CTA target is `willpwr.app/signup`.
- **willpwr.app** — the actual web app (separate codebase). Unauthenticated visitors there are redirected here, *except* for `/login`, `/signup`, and `/reset-password`, which must remain accessible. UTM params must be preserved through the redirect.

When in doubt about scope: this repo owns the marketing surface; the app surface lives elsewhere. Don't add app/auth logic here.

## Source of truth: the Kiro spec

`.kiro/specs/willpwr-website/requirements.md` is the canonical product spec (15 requirements, EARS-style acceptance criteria). Read it before making product/UX decisions — it defines required pages, performance targets, and compliance constraints. Highlights worth keeping in mind when implementing anything:

- **Required routes:** `/` (landing), `/pricing`, `/help`, `/help/*` articles with search, `/contact`, `/terms`, `/privacy`, plus `sitemap.xml` and `robots.txt`. `/blog` is explicitly **deferred** — do not build it unless asked.
- **Performance budgets:** Lighthouse Performance ≥ 90 mobile *and* desktop, Accessibility ≥ 90, homepage LCP ≤ 2.5s on the Lighthouse mobile preset (360px, simulated 4G). These are hard requirements, not aspirations — they shape framework/image-format choices (WebP/AVIF with JPEG/PNG fallback is required for screenshots).
- **Compliance:** GDPR/CCPA cookie banner with three options (accept all / reject non-essential / customize). Analytics scripts MUST NOT load before consent, and must stop firing if consent is withdrawn mid-session. Consent persistence: 180–365 days.
- **SEO:** unique `<title>` (10–60 chars) and `<meta description>` (50–160 chars) per page; OG tags with absolute `og:image`; single `<h1>` per page; canonical link; sitemap.xml with all public pages; robots.txt with Sitemap directive.
- **Accessibility:** WCAG 2.1 AA contrast, WCAG 2.2 SC 2.4.11 focus indicators (≥2px, ≥3:1 contrast), full keyboard reachability, responsive 320px–2560px without horizontal scroll.
- **Contact form:** must have CAPTCHA or honeypot; delivers to `support@getwillpwr.com`. Sales inquiries go to `sales@getwillpwr.com`.
- **Hosting:** HTTPS-only with 301 from HTTP; `www.getwillpwr.com` 301s to `getwillpwr.com`; CDN with ≥1yr cache for fingerprinted assets, ≤1hr for non-versioned; custom 404 linking to `/` and `/help`.

If a request conflicts with the spec, surface the conflict rather than silently diverging.

## Kiro workflow

`.kiro/specs/willpwr-website/.config.kiro` shows `workflowType: requirements-first`. The expected progression is requirements → design → tasks → implementation. Requirements exist; design and tasks documents do not yet. If asked to start implementation, check whether design/tasks should be authored first.

## Commands

None yet — no package.json, Makefile, or task runner is present. Once a stack is chosen, add the build/dev/test/lint commands here.
