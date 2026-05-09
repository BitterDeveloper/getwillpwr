# Implementation Plan: willpwr-website

## Resume here (2026-05-09)

**Build is green:** typecheck clean, 39/39 vitest passing, `npm run build` produces 17 static pages + Pagefind index. Last commits: `d6fd9fe` (scaffold + reconciled tasks), `c2db9bc` (playwright version fix).

### Decision needed before more work on Task 1
Spec mandates `output: 'export'` (pure SSG) but `app/api/contact/route.ts` is incompatible — static export doesn't support Route Handlers. Pick one:
1. **Keep API route, drop `output: 'export'`** (current state). Update spec to reflect Vercel hybrid SSG + serverless function.
2. **Keep static export, move contact to a Vercel Function or external form service.** Move `app/api/contact/route.ts` out of the app router.

Once decided, close out Task 1.

### Open required tasks
- **13.2** — audit every page's `generateMetadata` for title (10–60), description (50–160), unique titles, canonical, OG.
- **13.3** — audit every page for exactly one `<h1>` and no heading-level skips.

### Open optional `*` tests (none block MVP, but listed for completeness)
- **3.5 / 3.6** — fast-check property tests for footer + nav links on every page (Properties 8, 9). Existing unit tests check one page each.
- **4.3** — unit tests for CookieBanner + PostHogProvider (consent options render; opt-out on withdrawal).
- **4.4 / 4.5 / 4.6 / 4.7** — property tests for Properties 14, 15, 16, 17 (analytics absent without consent; expiry window; signup CTA conversion event; UTM passthrough).
- **9.8** — property test Property 7 (every help article has a Contact Support link).
- **11.4 / 11.6** — Property 18 fast-check at the form-component level; ContactForm unit tests for Resend failure + reset on success.
- **13.4** — Property 10 fast-check for title/description bounds (current test is example-based).
- **13.6** — Property 12 fast-check for single h1 + no heading skips.
- **18.1** — Playwright + Lighthouse CI: homepage LCP ≤ 2.5s mobile.

### Checkpoint gates (still open)
- **5, 12, 17, 19** — re-verify tests at each milestone before closing.

### Quick start when resuming
```bash
cd ~/Development/bitterdeveloper/willpwr/getwillpwr
npm run typecheck && npm run test && npm run build   # confirm still green
git log --oneline -5                                  # confirm c2db9bc is HEAD
```

---

## Overview

Build the getwillpwr.com marketing and product website as a statically generated Next.js App Router application deployed to Vercel. The implementation proceeds in layers: project scaffolding and shared infrastructure first, then page-by-page feature work, then analytics/consent integration, then the contact API, and finally search, testing, and build tooling.

## Tasks

- [ ] 1. Scaffold project and configure build infrastructure
  - Initialize Next.js App Router project with `output: 'export'` (SSG), TypeScript strict mode, Tailwind CSS, and ESLint
  - Configure `next.config.ts`: `images.unoptimized: false`, `trailingSlash: true`, `basePath` empty
  - Add Vercel config (`vercel.json`) with `www` → apex 301 redirect rule and cache-control headers (1yr for fingerprinted assets, 1hr for non-versioned)
  - Create `/public/robots.txt` permitting all public paths, disallowing `/api/`, and including `Sitemap: https://getwillpwr.com/sitemap.xml`
  - Set up Vitest config (`vitest.config.ts`) with jsdom environment, React Testing Library, and fast-check
  - Set up Playwright config (`playwright.config.ts`) targeting the local dev server
  - Install and pin all dependencies: `next`, `react`, `react-dom`, `tailwindcss`, `@next/mdx`, `next-mdx-remote`, `zod`, `react-hook-form`, `@hookform/resolvers`, `posthog-js`, `vanilla-cookieconsent`, `resend`, `fast-check`, `vitest`, `@testing-library/react`, `@playwright/test`, `@axe-core/playwright`
  - _Requirements: 14.1, 14.7, 15.1, 15.3_
  - **OPEN ISSUE:** `output: 'export'` is NOT set in `next.config.ts`. The spec mandates SSG via static export, but the implementation has an `/api/contact` Route Handler (Task 11.2) which is incompatible with `output: 'export'`. Either the static-export requirement or the API route needs to change. Surface this to the user before closing this task.

- [x] 2. Define shared types, content config, and data models
  - [x] 2.1 Create `content/pricing.ts` with the `PricingTier` interface and all four tiers (Free, Pro Monthly $9.97, Pro Annual $79.97/yr, Lifetime $97) and `pricingFaq` array
    - Use exact values from design doc: `monthlyPrice` in cents, `annualPrice` in cents or null
    - _Requirements: 4.1, 4.2, 4.3, 4.6_
  - [x] 2.2 Create `content/screenshots.ts` with the `Screenshot` interface and at least three placeholder entries (src, alt ≤ 125 chars, caption ≤ 80 chars, width, height)
    - _Requirements: 3.1, 3.2, 3.5_
  - [x] 2.3 Create `lib/pricing.ts` exporting `computeAnnualSavings(tier: PricingTier): { savings: number; perMonth: number }` pure function
    - Formula: `savings = monthlyPrice * 12 - annualPrice`; `perMonth = Math.round(annualPrice / 12)`
    - _Requirements: 4.3_
  - [x]* 2.4 Write property test for annual savings calculation
    - **Property 6: Annual savings calculation is correct**
    - **Validates: Requirements 4.3**
    - Tag: `// Feature: willpwr-website, Property 6: Annual savings calculation is correct`
  - [x] 2.5 Create `lib/metadata.ts` exporting `baseMetadata` and a `buildMetadata(page)` helper that merges per-page title/description/canonical into the base OG/Twitter config
    - _Requirements: 10.1, 10.2, 10.6_
  - [x] 2.6 Create `types/index.ts` re-exporting all shared interfaces (`PricingTier`, `Screenshot`, `HelpArticleFrontmatter`, `ConsentState`, `ContactSubmission`, `ContactResponse`)
    - _Requirements: (cross-cutting)_

- [x] 3. Implement root layout, Nav, and Footer
  - [x] 3.1 Create `app/layout.tsx` as the root layout: imports global CSS, renders `<Nav>`, `<Footer>`, `<CookieBanner>`, and `<PostHogProvider>` wrapping `{children}`; sets `metadataBase`
    - _Requirements: 9.1, 9.4, 8.1_
  - [x] 3.2 Create `components/layout/Nav.tsx` (server component) and `components/layout/MobileMenu.tsx` (client component)
    - Nav renders: Willpwr logo → `/`, links to `/pricing` and `/help`, "Get Started" button → `https://willpwr.app/signup`
    - MobileMenu uses `useState` for open/close; collapses at `< 768px` via Tailwind responsive classes
    - _Requirements: 9.1, 9.2, 9.3_
  - [x] 3.3 Create `components/layout/Footer.tsx` (server component)
    - Renders links to `/terms`, `/privacy`, `/help`, `/pricing`, at least one social media URL
    - Copyright year: `new Date().getFullYear()` — dynamic at build time
    - Footer tagline: "AI-powered productivity for people who want to do their best work."
    - _Requirements: 9.4, 9.5, 6.3, 7.3_
  - [x]* 3.4 Write unit tests for Nav and Footer
    - Nav: assert all required links present (`/`, `/pricing`, `/help`, `https://willpwr.app/signup`)
    - Footer: assert links to `/terms`, `/privacy`, `/help`, `/pricing`, social URL; assert copyright year matches `new Date().getFullYear()`
    - _Requirements: 9.1, 9.4, 9.5_
  - [ ]* 3.5 Write property test for footer links on every page
    - **Property 8: Footer contains all required links on every page**
    - **Validates: Requirements 6.3, 7.3, 9.4**
    - Tag: `// Feature: willpwr-website, Property 8: Footer contains all required links on every page`
  - [ ]* 3.6 Write property test for nav links on every page
    - **Property 9: Nav contains all required links on every page**
    - **Validates: Requirements 9.1**
    - Tag: `// Feature: willpwr-website, Property 9: Nav contains all required links on every page`

- [x] 4. Implement cookie consent and analytics providers
  - [x] 4.1 Create `components/consent/CookieBanner.tsx` (client component)
    - Initialize `vanilla-cookieconsent` with three categories: `necessary`, `analytics`, `advertising`
    - Render accept-all, reject-non-essential, and customize options
    - Include visible link to `/privacy`
    - Fire `onAccept`/`onReject` callbacks to update PostHog consent state
    - Store preference for 180 days (configurable up to 365)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 4.2 Create `components/analytics/PostHogProvider.tsx` (client component)
    - Initialize PostHog only after `analytics` consent is accepted
    - Call `posthog.opt_out_capturing()` when consent is withdrawn mid-session
    - Read consent state from vanilla-cookieconsent's API
    - _Requirements: 11.1, 11.3, 11.4_
  - [ ]* 4.3 Write unit tests for CookieBanner and PostHogProvider
    - CookieBanner: renders three consent options; includes `/privacy` link
    - PostHogProvider: does not initialize PostHog when consent absent; calls `opt_out_capturing` on withdrawal
    - _Requirements: 8.2, 8.5, 11.3, 11.4_
  - [ ]* 4.4 Write property test for analytics absent without consent
    - **Property 14: Analytics scripts are absent when consent is not accepted**
    - **Validates: Requirements 8.3, 11.3**
    - Tag: `// Feature: willpwr-website, Property 14: Analytics scripts are absent when consent is not accepted`
  - [ ]* 4.5 Write property test for consent expiry window
    - **Property 15: Consent preference expiry is within the 180–365 day window**
    - **Validates: Requirements 8.4**
    - Tag: `// Feature: willpwr-website, Property 15: Consent preference expiry is within the 180–365 day window`
  - [ ]* 4.6 Write property test for signup CTA conversion event
    - **Property 16: Signup CTA clicks fire a conversion event**
    - **Validates: Requirements 11.2**
    - Tag: `// Feature: willpwr-website, Property 16: Signup CTA clicks fire a conversion event`
  - [ ]* 4.7 Write property test for UTM parameter passthrough to analytics
    - **Property 17: UTM parameters are passed to analytics**
    - **Validates: Requirements 11.5**
    - Tag: `// Feature: willpwr-website, Property 17: UTM parameters are passed to analytics`

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement homepage
  - [x] 6.1 Create `components/home/Hero.tsx`
    - Headline: "Less app-switching. More deep work."
    - Sub-headline: "All your tasks, email, calendar, and focus sessions in one place — with an AI assistant that helps you plan, focus, and stay on track."
    - Primary CTA: "Get started free" → `https://willpwr.app/signup` (same tab, no `target="_blank"`)
    - Secondary CTA: "See pricing" → `/pricing`
    - _Requirements: 2.1, 2.5_
  - [x] 6.2 Create `components/home/Features.tsx`
    - Display at least three core capabilities (Task management, AI assistant, Weekly planning, Focus sessions)
    - Each feature: concise copy ≤ 150 chars, supporting icon with descriptive alt text
    - _Requirements: 2.2_
  - [x] 6.3 Create `components/home/Testimonials.tsx`
    - Display at least one testimonial/user quote with attributed name or handle
    - Social proof stats: 12,000+ users, 3,400+ tasks logged, 95% satisfaction, 4.9/5 rating
    - _Requirements: 2.3_
  - [x] 6.4 Create `components/home/Screenshots.tsx` and `components/home/Lightbox.tsx`
    - Screenshots section: renders minimum three screenshots from `content/screenshots.ts` using `next/image`
    - Each screenshot: caption ≤ 80 chars, alt ≤ 125 chars, WebP/AVIF via `next/image`
    - Lightbox (client component): opens on click at viewport ≥ 1024px; dismissible via close button or Escape key
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 6.5 Create `components/home/SecondaryCtaSection.tsx`
    - Visible CTA button → `https://willpwr.app/signup` above the footer
    - _Requirements: 2.4, 2.5_
  - [x] 6.6 Create `app/page.tsx` composing all homepage sections; export `generateMetadata` with unique title (10–60 chars), description (50–160 chars), canonical `https://getwillpwr.com/`, and OG tags
    - _Requirements: 2.1–2.5, 10.1, 10.2, 10.5, 10.6_
  - [x]* 6.7 Write property test for signup CTA links
    - **Property 1: Signup CTA links target willpwr.app/signup**
    - **Validates: Requirements 2.5**
    - Tag: `// Feature: willpwr-website, Property 1: Signup CTA links target willpwr.app/signup`
  - [x]* 6.8 Write unit tests for homepage components
    - Hero: primary CTA href is `https://willpwr.app/signup`, no `target="_blank"`
    - SecondaryCtaSection: CTA href is `https://willpwr.app/signup`
    - Lightbox: opens on screenshot click; closes on Escape key; closes on close button click
    - _Requirements: 2.1, 2.4, 2.5, 3.3_

- [x] 7. Implement screenshot content validation
  - [x] 7.1 Write property tests for screenshot data constraints
    - **Property 2: Screenshot captions are within the character limit**
    - **Validates: Requirements 3.2**
    - Tag: `// Feature: willpwr-website, Property 2: Screenshot captions are within the character limit`
    - **Property 3: Screenshot alt text is present and within the character limit**
    - **Validates: Requirements 3.5**
    - Tag: `// Feature: willpwr-website, Property 3: Screenshot alt text is present and within the character limit`
  - [x]* 7.2 Write property test for screenshot image format
    - **Property 4: Screenshot images use next-gen formats**
    - **Validates: Requirements 3.4**
    - Tag: `// Feature: willpwr-website, Property 4: Screenshot images use next-gen formats`

- [x] 8. Implement pricing page
  - [x] 8.1 Create `components/pricing/BillingToggle.tsx` (client component)
    - Toggle between `monthly` and `annual` billing cycle state
    - _Requirements: 4.2, 4.3_
  - [x] 8.2 Create `components/pricing/PricingCard.tsx`
    - Renders tier name, price (monthly or annual based on `billingCycle` prop), feature list, CTA button
    - For annual billing: display per-month equivalent and savings badge using `computeAnnualSavings`
    - Detect `id === 'lifetime'` and render as one-time price (not monthly/annual rate)
    - Display free badge and feature restrictions when `isFree === true`
    - Display `badge` label (e.g., "Best Value") when non-null
    - _Requirements: 4.2, 4.3, 4.4, 4.6_
  - [x] 8.3 Create `components/pricing/PricingGrid.tsx`
    - Renders all four tiers from `pricingTiers` config using `PricingCard`
    - Passes `billingCycle` state from `BillingToggle`
    - _Requirements: 4.1, 4.2_
  - [x] 8.4 Create `components/pricing/PricingFaq.tsx`
    - Renders all FAQ entries from `pricingFaq` config (minimum five questions)
    - Includes visible link/email for sales inquiries (`sales@getwillpwr.com`)
    - _Requirements: 4.5_
  - [x] 8.5 Create `app/pricing/page.tsx` composing pricing components; export `generateMetadata` with unique title, description, canonical, and OG tags
    - _Requirements: 4.1–4.6, 10.1, 10.2, 10.5, 10.6_
  - [x]* 8.6 Write property test for pricing tier config rendering
    - **Property 5: Pricing tier config renders all required fields**
    - **Validates: Requirements 4.2**
    - Tag: `// Feature: willpwr-website, Property 5: Pricing tier config renders all required fields`
  - [x]* 8.7 Write unit tests for PricingCard
    - Renders all required fields for each tier
    - Savings calculation correct for Pro Annual tier
    - Lifetime tier renders as one-time price
    - Free tier shows badge and feature restrictions
    - _Requirements: 4.2, 4.3, 4.6_

- [x] 9. Implement Help Center
  - [x] 9.1 Create `content/help/` directory with at least three MDX articles across three categories (`getting-started`, `account-billing`, `using-the-app`), each with valid frontmatter (`title`, `category`, `description`, `order`, `updatedAt`)
    - _Requirements: 5.1, 5.4_
  - [x] 9.2 Create `lib/help.ts` with `getArticles()`, `getArticleBySlug(slug)`, and `getCategories()` functions that read and parse MDX frontmatter at build time
    - _Requirements: 5.1, 5.4_
  - [x] 9.3 Create `components/help/CategoryList.tsx` rendering articles grouped by category, each category visually distinct and labeled
    - _Requirements: 5.4_
  - [x] 9.4 Create `components/help/SearchBar.tsx` (client component) integrating Pagefind
    - Displays results within 1 second of query submission
    - Shows "No results found for '[query]'" with link to `/contact` when no results
    - Shows "Search unavailable — browse categories below" if Pagefind fails to load after 5 seconds
    - _Requirements: 5.2, 5.3, 5.6_
  - [x] 9.5 Create `components/help/ArticleLayout.tsx`
    - Renders MDX article content with a "Contact Support" link → `/contact`
    - _Requirements: 5.5_
  - [x] 9.6 Create `app/help/page.tsx` (Help Center index) with `CategoryList` and `SearchBar`; export `generateMetadata`
    - _Requirements: 5.1, 5.4, 10.1, 10.2, 10.5, 10.6_
  - [x] 9.7 Create `app/help/[slug]/page.tsx` with `generateStaticParams` reading all MDX slugs; render article via `ArticleLayout`; export `generateMetadata` using article frontmatter
    - _Requirements: 5.1, 5.5, 10.1, 10.2, 10.5, 10.6_
  - [ ]* 9.8 Write property test for help article Contact Support link
    - **Property 7: Help article pages always contain a Contact Support link**
    - **Validates: Requirements 5.5**
    - Tag: `// Feature: willpwr-website, Property 7: Help article pages always contain a Contact Support link`
  - [x]* 9.9 Write unit tests for SearchBar
    - Displays no-results message with `/contact` link when Pagefind returns empty results
    - Shows unavailable message after 5-second load timeout
    - _Requirements: 5.3, 5.6_

- [x] 10. Implement legal pages (Terms and Privacy)
  - [x] 10.1 Create `content/terms.mdx` with Terms of Service content including effective date at the top
    - _Requirements: 6.1, 6.2, 6.4_
  - [x] 10.2 Create `content/privacy.mdx` with Privacy Policy content including effective date and all required sections: data collected, purposes, retention, GDPR rights, CCPA rights
    - _Requirements: 7.1, 7.2, 7.4_
  - [x] 10.3 Create `app/terms/page.tsx` rendering `content/terms.mdx`; export `generateMetadata` with unique title, description, canonical, and OG tags
    - _Requirements: 6.1, 6.2, 6.3, 10.1, 10.2, 10.5, 10.6_
  - [x] 10.4 Create `app/privacy/page.tsx` rendering `content/privacy.mdx`; export `generateMetadata` with unique title, description, canonical, and OG tags
    - _Requirements: 7.1, 7.2, 7.3, 10.1, 10.2, 10.5, 10.6_

- [x] 11. Implement contact page and API route
  - [x] 11.1 Create `components/contact/ContactForm.tsx` (client component)
    - Use `react-hook-form` + `zod` schema: name (1–100), email (valid), subject (1–150), message (10–5000), `_hp` honeypot (max 0)
    - Display inline validation errors per field without page reload on invalid submission
    - On valid submit: POST to `/api/contact`; show confirmation message and reset form on success; show error with retry on failure
    - Network timeout: 10 seconds; show retry error on timeout
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  - [x] 11.2 Create `app/api/contact/route.ts` (Route Handler)
    - Parse and validate request body with zod `contactSchema`
    - Return 400 if `_hp` is non-empty (honeypot triggered)
    - Return 400 for validation failures
    - Call Resend API to deliver to `support@getwillpwr.com`
    - Return 429 for rate limiting; 500 for Resend failures
    - _Requirements: 13.3, 13.5_
  - [x] 11.3 Create `app/contact/page.tsx` rendering `ContactForm`; export `generateMetadata`
    - _Requirements: 13.1, 10.1, 10.2, 10.5, 10.6_
  - [ ]* 11.4 Write property test for contact form validation
    - **Property 18: Contact form rejects invalid inputs with inline errors**
    - **Validates: Requirements 13.2, 13.4**
    - Tag: `// Feature: willpwr-website, Property 18: Contact form rejects invalid inputs with inline errors`
  - [x]* 11.5 Write property test for honeypot spam blocking
    - **Property 19: Honeypot field blocks spam submissions**
    - **Validates: Requirements 13.5**
    - Tag: `// Feature: willpwr-website, Property 19: Honeypot field blocks spam submissions`
  - [ ]* 11.6 Write unit tests for ContactForm
    - Validation errors appear for each invalid field type
    - Honeypot rejection returns 400 (mocked fetch)
    - Successful submission shows confirmation and resets form (mocked fetch)
    - Resend failure shows error with retry option
    - _Requirements: 13.2, 13.3, 13.4, 13.5_

- [ ] 12. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement SEO infrastructure (sitemap, metadata, canonical)
  - [x] 13.1 Create `app/sitemap.ts` exporting a `sitemap()` function that returns all public page URLs with `lastModified`
    - Include: `/`, `/pricing`, `/help`, `/help/[slug]` (all slugs), `/terms`, `/privacy`, `/contact`
    - _Requirements: 10.3_
  - [ ] 13.2 Audit all page `generateMetadata` exports to ensure title (10–60 chars), description (50–160 chars), canonical URL, and OG tags are present and unique across pages
    - _Requirements: 10.1, 10.2, 10.6_
  - [ ] 13.3 Audit all page components to ensure exactly one `<h1>` per page and no heading level skips (`h1` → `h2` → `h3`)
    - _Requirements: 10.5_
  - [ ]* 13.4 Write property test for page title and meta description bounds
    - **Property 10: Page titles and meta descriptions are within required bounds**
    - **Validates: Requirements 10.1**
    - Tag: `// Feature: willpwr-website, Property 10: Page titles and meta descriptions are within required bounds`
  - [x]* 13.5 Write property test for OG tags and absolute og:image
    - **Property 11: OG tags are present and og:image is an absolute URL**
    - **Validates: Requirements 10.2**
    - Tag: `// Feature: willpwr-website, Property 11: OG tags are present and og:image is an absolute URL`
  - [ ]* 13.6 Write property test for single h1 and no heading level skips
    - **Property 12: Each page has exactly one h1 with no heading level skips**
    - **Validates: Requirements 10.5**
    - Tag: `// Feature: willpwr-website, Property 12: Each page has exactly one h1 with no heading level skips`
  - [x]* 13.7 Write property test for canonical tag matching page URL
    - **Property 13: Canonical tag matches the page's own URL**
    - **Validates: Requirements 10.6**
    - Tag: `// Feature: willpwr-website, Property 13: Canonical tag matches the page's own URL`

- [x] 14. Implement 404 and error pages
  - [x] 14.1 Create `app/not-found.tsx` with links to `/` and `/help`; export `generateMetadata`
    - _Requirements: 15.4_
  - [x] 14.2 Create `app/error.tsx` (Next.js error boundary) with generic message and link to `/`
    - _Requirements: 15.5_

- [x] 15. Implement Pagefind post-build search index
  - [x] 15.1 Add `pagefind` as a dev dependency and create `scripts/pagefind.ts` (or shell script) that runs `pagefind --site .next/server/app` after `next build`
    - Update `package.json` `build` script: `next build && node scripts/pagefind.ts`
    - _Requirements: 5.2, 5.3_
  - [x] 15.2 Verify `SearchBar.tsx` loads the Pagefind WASM bundle from the generated static index and handles the 5-second load timeout
    - _Requirements: 5.2, 5.3_

- [x] 16. Implement build-time content validation script
  - [x] 16.1 Create `scripts/validate-content.ts` that asserts at build time:
    - All screenshot entries: `alt` ≤ 125 chars, `caption` ≤ 80 chars, `src` non-empty
    - All help article frontmatter: required fields present, `description` 50–160 chars
    - All page metadata: title 10–60 chars, description 50–160 chars, titles unique
    - Pricing config: at least one tier, at least five FAQ entries
    - Exit with non-zero code on any violation
    - _Requirements: 3.2, 3.5, 5.1, 10.1_
  - [x] 16.2 Wire `validate-content.ts` into the `prebuild` npm script so it runs before `next build`
    - _Requirements: (build integrity)_

- [ ] 17. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Playwright smoke and integration tests
  - [ ]* 18.1 Write Playwright test: homepage LCP ≤ 2.5s (mobile) via Lighthouse CI assertion
    - _Requirements: 2.6, 14.1_
  - [x]* 18.2 Write Playwright test: `/sitemap.xml` is valid XML containing all public page URLs
    - _Requirements: 10.3_
  - [x]* 18.3 Write Playwright test: `/robots.txt` contains `Sitemap:` directive pointing to absolute URL
    - _Requirements: 10.4_
  - [x]* 18.4 Write Playwright test: custom 404 page has functional links to `/` and `/help`
    - _Requirements: 15.4_
  - [x]* 18.5 Write Playwright test: contact form end-to-end with mocked Resend — submit valid form, assert confirmation message
    - _Requirements: 13.3_
  - [x]* 18.6 Write Playwright test: analytics (PostHog) script absent in DOM when no consent cookie present
    - _Requirements: 11.3_
  - [x]* 18.7 Write Playwright test: cookie banner visible on first visit with no consent cookie; banner includes `/privacy` link
    - _Requirements: 8.1, 8.5_
  - [x]* 18.8 Write Playwright + axe-core accessibility tests on all pages (Lighthouse Accessibility ≥ 90)
    - _Requirements: 14.2_

- [ ] 19. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical milestones
- Property tests (fast-check) validate universal correctness properties with ≥ 100 iterations each
- Unit tests validate specific examples and edge cases
- Property 20 (URL query parameter preservation through app-to-website redirect) is implemented and tested in the **willpwr.app** codebase, not this repo — it is excluded from this task list per the design doc note
- The `content/pricing.ts` file is the single source of truth for all pricing data; never hardcode prices in components
- All CTA links to `willpwr.app/signup` must use the same browser tab (no `target="_blank"`)
- Pagefind runs as a post-build step; the search index is not available during `next dev` — use a mock or skip search tests in dev mode

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.2", "2.3", "2.5", "2.6"] },
    { "id": 1, "tasks": ["2.4", "3.1", "3.2", "3.3", "8.1"] },
    { "id": 2, "tasks": ["3.4", "3.5", "3.6", "4.1", "4.2", "6.1", "6.2", "6.3", "6.4", "6.5", "8.2", "9.2", "10.1", "10.2"] },
    { "id": 3, "tasks": ["4.3", "4.4", "4.5", "4.6", "4.7", "6.6", "6.7", "6.8", "7.1", "7.2", "8.3", "8.4", "8.5", "9.1", "9.3", "9.4", "9.5", "11.1", "11.2"] },
    { "id": 4, "tasks": ["8.6", "8.7", "9.6", "9.7", "9.8", "9.9", "10.3", "10.4", "11.3", "11.4", "11.5", "11.6"] },
    { "id": 5, "tasks": ["13.1", "13.2", "13.3", "14.1", "14.2", "15.1", "16.1"] },
    { "id": 6, "tasks": ["13.4", "13.5", "13.6", "13.7", "15.2", "16.2"] },
    { "id": 7, "tasks": ["18.1", "18.2", "18.3", "18.4", "18.5", "18.6", "18.7", "18.8"] }
  ]
}
```
