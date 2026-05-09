# Requirements Document

## Introduction

Willpwr is a virtual assistant and coaching app that helps people build willpower and achieve their goals. This document covers the requirements for the **getwillpwr.com** marketing and product website — the primary public-facing presence for the Willpwr brand. It also covers the redirect strategy from **willpwr.app**, which hosts the web app itself and should funnel unauthenticated visitors to the main marketing site.

The website must serve as a conversion-focused marketing hub, a self-service help center, a legal compliance resource, and a trust-building platform for prospective and existing users.

## Glossary

- **Website**: The getwillpwr.com marketing and product website
- **App**: The Willpwr web application hosted at willpwr.app
- **Visitor**: An unauthenticated user browsing getwillpwr.com
- **User**: An authenticated or registered Willpwr app user
- **CTA**: Call-to-action element (button, link, or form) prompting a conversion action
- **Hero_Section**: The primary above-the-fold section of the landing page
- **Nav**: The site-wide navigation header component
- **Footer**: The site-wide footer component
- **Pricing_Page**: The page at /pricing describing subscription tiers and costs
- **Help_Center**: The documentation and support section at /help
- **Blog**: The optional editorial content section at /blog
- **SEO**: Search engine optimization practices applied to page metadata and content
- **Analytics**: Tracking and measurement of visitor behavior via analytics tooling
- **Cookie_Banner**: The GDPR/CCPA-compliant consent notice shown on first visit
- **Redirect_Handler**: The logic on willpwr.app that routes unauthenticated visitors to getwillpwr.com

---

## Requirements

### Requirement 1: App-to-Website Redirect Strategy

**User Story:** As a visitor who lands on willpwr.app without being logged in, I want to be redirected to the main marketing website, so that I can learn about Willpwr before signing up.

#### Acceptance Criteria

1. WHEN an unauthenticated visitor navigates to willpwr.app (any path except /login, /signup, and /reset-password), THE Redirect_Handler SHALL redirect the visitor to getwillpwr.com within 1 second.
2. WHEN an unauthenticated visitor is redirected to getwillpwr.com, THE Redirect_Handler SHALL preserve all query parameters from the original request URL — including utm_source, utm_medium, utm_campaign, utm_term, and utm_content — unchanged in the redirect destination URL.
3. WHILE a User is authenticated, THE App SHALL display the application interface and SHALL NOT redirect the User to getwillpwr.com.
4. IF the redirect is executed client-side, THEN THE App SHALL display a branded splash screen for no more than 1 second before executing the redirect for unauthenticated visitors.
5. THE App login page at willpwr.app/login SHALL render the login form to unauthenticated visitors without redirecting to getwillpwr.com.
6. THE App pages at willpwr.app/signup and willpwr.app/reset-password SHALL remain accessible to unauthenticated visitors and SHALL NOT redirect to getwillpwr.com.

---

### Requirement 2: Landing / Marketing Page

**User Story:** As a visitor to getwillpwr.com, I want to understand what Willpwr does and why I should use it, so that I can decide whether to sign up.

#### Acceptance Criteria

1. THE Website SHALL display a Hero_Section on the homepage that includes a headline, a sub-headline describing the core value proposition, and a primary CTA button linking to willpwr.app/signup.
2. THE Website SHALL display a features section on the homepage that describes at least three core capabilities of the Willpwr app, each with concise copy of no more than 150 characters and a supporting icon or illustration with descriptive alt text.
3. THE Website SHALL display a social proof section on the homepage that includes at least one testimonial or user quote with the attributed name or handle.
4. THE Website SHALL display a secondary CTA section above the Footer on the homepage containing a visible CTA button that links to willpwr.app/signup.
5. WHEN a Visitor clicks any signup CTA on the homepage, THE Website SHALL navigate the Visitor to willpwr.app/signup in the same browser tab.
6. THE Website SHALL render the homepage with a Largest Contentful Paint (LCP) of 2.5 seconds or less as measured by the Lighthouse mobile preset (360px viewport, simulated 4G throttling).

---

### Requirement 3: App Screenshots / Visual Showcase

**User Story:** As a visitor evaluating Willpwr, I want to see what the app looks like, so that I can set expectations before signing up.

#### Acceptance Criteria

1. THE Website SHALL display a screenshots section on the homepage or a dedicated /screenshots page containing a minimum of three app screenshots or mockup images.
2. THE Website SHALL display each screenshot with a descriptive caption of no more than 80 characters explaining the feature shown.
3. WHEN a Visitor clicks a screenshot on a viewport of 1024px wide or greater, THE Website SHALL display the screenshot in a lightbox or expanded view, and the lightbox SHALL be dismissible via a close button or pressing the Escape key.
4. THE Website SHALL serve all screenshot images in WebP or AVIF format with a JPEG or PNG fallback for browsers that do not support next-generation formats.
5. THE Website SHALL include non-empty alt text of no more than 125 characters on every screenshot image that describes the feature shown, for accessibility compliance.

---

### Requirement 4: Pricing Page

**User Story:** As a visitor considering Willpwr, I want to see clear pricing information, so that I can evaluate whether the product fits my budget.

#### Acceptance Criteria

1. THE Website SHALL provide a Pricing_Page at the /pricing path that lists all available subscription tiers.
2. THE Pricing_Page SHALL display for each tier: the tier name, monthly price, annual price (if applicable), a list of included features, and a CTA button.
3. WHERE an annual billing option exists, THE Pricing_Page SHALL display the per-month equivalent cost and the total savings calculated as (monthly price × 12) − annual price.
4. WHEN a Visitor clicks a pricing CTA, THE Website SHALL navigate the Visitor to the corresponding signup or checkout flow at willpwr.app; IF navigation fails, THE Website SHALL display an error message with a retry option.
5. THE Pricing_Page SHALL include a FAQ section addressing at least five common billing and subscription questions, with a visible link or email address (sales@getwillpwr.com) for sales inquiries.
6. IF a free tier or free trial exists, THEN THE Pricing_Page SHALL display a visible badge or label identifying it as free, and SHALL enumerate any feature restrictions and the trial duration in days.

---

### Requirement 5: Help / Documentation Section

**User Story:** As a Willpwr user or prospective user, I want to find answers to my questions without contacting support, so that I can resolve issues quickly on my own.

#### Acceptance Criteria

1. THE Website SHALL provide a Help_Center at the /help path containing categorized documentation articles.
2. THE Help_Center SHALL include a search input that accepts keyword queries and returns matching articles.
3. WHEN a Visitor submits a search query in the Help_Center, THE Website SHALL display relevant article results within 1 second of the query submission.
4. THE Help_Center SHALL organize articles into a minimum of three logical categories (e.g., Getting Started, Account & Billing, Using the App), with each category visually distinct and labeled.
5. THE Help_Center SHALL include a "Contact Support" link or button accessible from every help article page that navigates to /contact or opens a support form.
6. IF no search results are found for a query, THEN THE Help_Center SHALL display a message stating no results were found and providing a direct link to the Contact Support page.

---

### Requirement 6: Terms of Service

**User Story:** As a visitor or user, I want to read the Terms of Service, so that I understand the legal agreement governing my use of Willpwr.

#### Acceptance Criteria

1. THE Website SHALL provide a Terms of Service page at the /terms path.
2. THE Website SHALL display the effective date of the current Terms of Service at the top of the /terms page.
3. THE Website SHALL link to the /terms page from the Footer on every page of the Website.
4. THE effective date displayed on the /terms page SHALL match the date the Terms of Service content was last revised, making it independently verifiable.
5. WHEN a Visitor reaches the step in the willpwr.app signup or account creation flow where they submit the registration form, THE App SHALL display a visible link to /terms on that page before the submission action is available.

---

### Requirement 7: Privacy Policy

**User Story:** As a visitor or user, I want to read the Privacy Policy, so that I understand how my personal data is collected, used, and protected.

#### Acceptance Criteria

1. THE Website SHALL provide a Privacy Policy page at the /privacy path.
2. THE Website SHALL display the effective date of the current Privacy Policy at the top of the /privacy page.
3. THE Website SHALL link to the /privacy page from the Footer on every page of the Website.
4. THE Privacy Policy SHALL include all of the following sections: (a) categories of personal data collected, (b) purposes of data collection and processing, (c) data retention periods, (d) user rights under GDPR (access, rectification, erasure, portability, objection), and (e) user rights under CCPA (right to know, right to delete, right to opt out of sale).
5. WHEN a Visitor reaches any form step in the willpwr.app signup or account creation flow that collects personal data, THE App SHALL display a visible link to /privacy on that page before the form can be submitted.

---

### Requirement 8: Cookie Consent

**User Story:** As a visitor from a jurisdiction requiring cookie consent, I want to be informed about cookie usage and give or withhold consent, so that my privacy preferences are respected.

#### Acceptance Criteria

1. WHEN a Visitor loads any page of the Website and no stored consent preference exists or the stored preference has expired, THE Cookie_Banner SHALL be displayed.
2. THE Cookie_Banner SHALL offer the Visitor three options: accept all cookies (including analytics and advertising cookies), reject non-essential cookies (analytics and advertising), or customize cookie preferences by category.
3. IF a Visitor rejects non-essential cookies or dismisses the Cookie_Banner without making a selection, THEN THE Website SHALL not load analytics or advertising scripts until the Visitor's stored consent preference changes to acceptance.
4. THE Website SHALL store the Visitor's cookie consent preference in the browser (via cookie or localStorage) for a minimum of 180 days and a maximum of 365 days.
5. THE Cookie_Banner SHALL include a visible link to the /privacy page.

---

### Requirement 9: Site-Wide Navigation

**User Story:** As a visitor, I want consistent and intuitive navigation across the website, so that I can find any section without confusion.

#### Acceptance Criteria

1. THE Website SHALL display a Nav on every page containing links to: Home (/), Pricing (/pricing), Help (/help), and a "Get Started" CTA button linking to willpwr.app/signup.
2. WHEN a Visitor views the Website on a viewport narrower than 768px, THE Nav SHALL collapse into a mobile-friendly menu (e.g., hamburger menu) that expands on user interaction.
3. THE Nav SHALL display the Willpwr logo as a linked image that navigates to the homepage (/) when clicked.
4. THE Website SHALL display a Footer on every page containing links to: /terms, /privacy, /help, /pricing, and at least one social media profile.
5. THE Footer SHALL display the current copyright year rendered dynamically from the system date at build or request time.

---

### Requirement 10: SEO and Metadata

**User Story:** As the Willpwr marketing team, I want the website to be discoverable via search engines, so that organic traffic can grow without paid acquisition.

#### Acceptance Criteria

1. THE Website SHALL include on every page a `<title>` tag that is unique across all pages, non-empty, and between 10 and 60 characters, and a `<meta name="description">` tag that is unique across all pages, non-empty, and between 50 and 160 characters.
2. THE Website SHALL include on every page Open Graph meta tags: `og:title`, `og:description`, `og:url`, and `og:image`, where `og:image` is an absolute URL.
3. THE Website SHALL generate and serve a sitemap.xml file at /sitemap.xml listing all public pages.
4. THE Website SHALL serve a robots.txt file at /robots.txt that permits crawling of all public pages, disallows crawling of any admin or private paths, and includes a Sitemap directive pointing to the absolute URL of /sitemap.xml.
5. THE Website SHALL use a single `<h1>` element per page, with subsequent headings using `<h2>` and `<h3>` in hierarchical order without skipping levels.
6. THE Website SHALL include a `<link rel="canonical">` tag on every page whose href matches the page's own canonical URL.

---

### Requirement 11: Analytics

**User Story:** As the Willpwr team, I want to track visitor behavior on the website, so that I can make data-informed decisions about content and conversion optimization.

#### Acceptance Criteria

1. THE Website SHALL integrate a single configured analytics platform to track page views, sessions, and conversion events.
2. WHEN a Visitor clicks any signup CTA on the Website, THE Website SHALL fire a conversion event to the configured analytics platform.
3. IF a Visitor has not accepted analytics cookies, THEN THE Website SHALL not load the analytics platform scripts on page load.
4. IF a Visitor withdraws analytics consent after the analytics scripts have already loaded in the current session, THEN THE Website SHALL stop sending analytics events for the remainder of that session.
5. WHEN a Visitor arrives at the Website with UTM parameters in the URL, THE Website SHALL pass those UTM parameters to the analytics platform for the duration of the session.

---

### Requirement 12: Blog (Future Roadmap — Not in Current Scope)

> **Status:** Deferred. The blog feature is planned for a future release and is not part of the current implementation scope.

**User Story:** As the Willpwr marketing team, I want a blog section, so that we can publish content that drives SEO and builds authority around willpower and habit formation.

#### Future Acceptance Criteria (for reference only)

1. WHERE the Blog feature is enabled, THE Website SHALL provide a blog index page at /blog listing all articles with a published status and a publication date not in the future, each showing title, publication date, author name, and an excerpt of no more than 300 characters.
2. WHERE the Blog feature is enabled, THE Website SHALL provide individual article pages at /blog/{slug} displaying the article title, publication date, author name, and full body content.
3. WHERE the Blog feature is enabled, THE Website SHALL include on each blog post page the following Open Graph tags: og:title, og:description, og:url, og:type (set to "article"), and og:image (absolute URL), plus a JSON-LD Article schema block.
4. WHERE the Blog feature is enabled, THE Website SHALL display a "Related Articles" section at the bottom of each blog post showing a minimum of two posts from the same category or sharing at least one tag; IF fewer than two related posts exist, THE Website SHALL omit the section rather than show an incomplete list.
5. WHERE the Blog feature is enabled, THE Website SHALL include the /blog index page and each published article page as separate entries in sitemap.xml.

---

### Requirement 13: Contact / Support Page

**User Story:** As a visitor or user who cannot find an answer in the Help Center, I want a way to contact the Willpwr team, so that I can get help with my specific issue.

#### Acceptance Criteria

1. THE Website SHALL provide a contact page at /contact containing a support request form.
2. THE contact form SHALL collect: sender's name (required, max 100 characters), email address (required, valid format), subject (required, max 150 characters), and message body (required, 10–5000 characters).
3. WHEN a Visitor submits the contact form with all required fields completed and valid, THE Website SHALL display a confirmation message that persists until the Visitor navigates away, reset the form fields, and deliver the submission to support@getwillpwr.com; IF email delivery fails, THE Website SHALL display an error message with a retry option.
4. IF a Visitor submits the contact form with one or more required fields empty or with an invalid email format, THEN THE Website SHALL display inline validation errors identifying each invalid field without reloading the page.
5. THE Website SHALL protect the contact form against automated spam submissions using a CAPTCHA or honeypot mechanism; IF a submission is identified as spam, THE Website SHALL block the submission and display an error message to the Visitor.

---

### Requirement 14: Performance and Accessibility

**User Story:** As any visitor, I want the website to load quickly and be usable regardless of my device or accessibility needs, so that I have a positive experience with the Willpwr brand.

#### Acceptance Criteria

1. THE Website SHALL achieve a Google Lighthouse Performance score of 90 or above on the homepage using the Lighthouse mobile preset (360px viewport, simulated 4G throttling).
2. THE Website SHALL achieve a Google Lighthouse Accessibility score of 90 or above on all pages.
3. THE Website SHALL ensure all interactive elements are reachable via Tab and Shift+Tab keyboard navigation, activatable via Enter or Space, and display a focus indicator with a minimum 2px outline and at least 3:1 contrast ratio against the adjacent background, conforming to WCAG 2.2 Success Criterion 2.4.11.
4. THE Website SHALL use color contrast ratios meeting WCAG 2.1 AA standards: minimum 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold).
5. THE Website SHALL be responsive and render correctly on viewport widths from 320px to 2560px without horizontal scrolling or content overflow.
6. THE Website SHALL serve all pages over HTTPS and issue a 301 redirect for any HTTP request to the equivalent HTTPS URL.
7. THE Website SHALL achieve a Google Lighthouse Performance score of 90 or above on the homepage using the Lighthouse desktop preset.

---

### Requirement 15: Domain and Hosting Infrastructure

**User Story:** As the Willpwr team, I want the website and app to be served from the correct domains with proper configuration, so that visitors always reach the right destination.

#### Acceptance Criteria

1. THE Website SHALL be served from the getwillpwr.com domain, with www.getwillpwr.com issuing a 301 permanent redirect to getwillpwr.com for all request paths.
2. THE App SHALL be served from the willpwr.app domain, with www.willpwr.app issuing a 301 permanent redirect to willpwr.app for all request paths.
3. THE Website SHALL use a CDN to serve static assets, with cache headers set to a minimum of 1 year (31,536,000 seconds) for versioned (fingerprinted) assets and a maximum of 1 hour (3,600 seconds) for non-versioned assets.
4. IF the Website returns a 404 for any path, THEN THE Website SHALL display a custom 404 page containing at least one functional link to the homepage (/) and at least one functional link to the Help Center (/help).
5. THE Website SHALL return HTTP status codes as follows: 200 for successfully found pages, 301 for permanent redirects, 404 for not-found pages, and 5xx codes for server-side errors, with 500 used for unhandled server errors.
