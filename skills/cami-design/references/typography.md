# Typography

Deep reference for type decisions. Loaded on demand.

## Scale

- Use a modular scale with at least a 1.25 ratio between steps.
- Fewer sizes, more contrast: a 5-step scale with 1.25 ratio creates clearer hierarchy than 8 sizes that are 1.1× apart.
- Marketing / content pages: fluid sizing via `clamp()` for headings.
- App UIs and dashboards: fixed `rem` scale. No major design system uses fluid type in product UI.

## Line Height

- Line-height scales **inversely** with line length. Narrow columns want tighter leading; wide columns want more.
- Light text on dark backgrounds: add `0.05–0.1` to line-height. Light type reads as lighter weight and needs more breathing room.
- Body text: cap line length at 65-75ch. Wider is fatiguing.
- Starting points (adjust per font — some fonts have more built-in spacing than others):
  - Headings: `1.1–1.2`
  - Body: `1.5–1.7`

## Weight & Contrast

- Hierarchy through weight + size + color + **space** — not size alone. Generous whitespace around an element draws the eye as effectively as bold or color.
- Avoid using more than 3 weights per page.
- Body copy: 400 or 450. Bold only where it earns attention.

## OpenType Features

- `font-variant-numeric: tabular-nums` for dynamically updating numbers (timers, counters, tables, prices).
- `font-feature-settings: "ss01"` etc. for stylistic sets where the typeface offers one.
- `text-wrap: balance` on headings (modern browsers) to avoid awkward breaks.
- `text-wrap: pretty` on body text to reduce orphans.

## Letter Spacing

Starting points — always check the design system first. If tokens exist for letter-spacing, use them.

- Small caps / uppercase labels: slightly open (`0.05–0.08em`)
- Large display / hero text: default or tight (`-0.01` to `-0.03em`)
- Body text: default (`0`) — optical tracking is built into well-designed body fonts

## Font Smoothing

- macOS: `-webkit-font-smoothing: antialiased` at the root makes text crisper. Test on Windows — too-thin rendering is a risk.

## Font Selection

- Pair a distinctive display font with a refined body font.
- Load via `@font-face` with `font-display: swap` unless you can guarantee preload without FOUT.
- Subset fonts. Ship only the weights and glyphs you use.

## Accessibility

- Minimum body size: 16px on web.
- Minimum contrast: 4.5:1 for body text, 3:1 for large text (≥ 18.66px or 14px bold).
- Don't rely on color alone for emphasis.
- **Use `rem` not `px` for font sizes.** `px` is absolute — if a user sets their browser font size to 20px for accessibility reasons, `px` values ignore it. `rem` scales with their preference. WCAG requires text to be zoomable to 200% without loss of content; `rem` guarantees this natively.

## Attribution

Based on principles synthesized from: anthropics/frontend-design, pbakaus/impeccable `typography.md`, jakubkrehel/make-interfaces-feel-better `typography.md`, emilkowalski/skill.
