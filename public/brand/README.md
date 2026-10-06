# Brand assets — interim marks

These are interim Willpwr marks pending **T-2W** (final logo/brand direction, blocked on John picking a designer). They are copies of the vault originals, with letterforms outlined as stroked SVG `<path>` elements instead of `<text>`, so they rasterize identically on every machine regardless of installed fonts. See `.kiro`/order 035 run log for why: the vault originals render "W" with live `<text font-family="'Inter', ...">`, and `sharp`'s bundled librsvg does not reliably render SVG `<text>` — it can silently drop the glyph or substitute a font, which is invisible at small icon sizes.

Vault originals (do not edit from this repo):

- `/Users/jheadlee/Obsidian Sync/Second Brain/1 - Projects/Products/Willpwr/Willpwr-Favicon.svg`
- `/Users/jheadlee/Obsidian Sync/Second Brain/1 - Projects/Products/Willpwr/Willpwr-Badge.svg`
- `/Users/jheadlee/Obsidian Sync/Second Brain/1 - Projects/Products/Willpwr/Willpwr-Wordmark.svg`

When T-2W lands: drop the new SVGs in here (same three filenames, same viewBoxes if possible) and run `npm run icons` to regenerate everything under `app/icon.png`, `app/apple-icon.png`, `public/icons/`, `public/favicon.ico`, and `public/og-default.png`. The wordmark is not currently used anywhere on the site — `components/layout/Logo.tsx` renders the favicon-derived mark as an image next to "Willpwr" as HTML text — so a new wordmark only needs to exist here if a future design calls for it.
