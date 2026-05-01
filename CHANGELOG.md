# Changelog

Track every absorption, addition, and substantive change. Each entry cites source when material came from an upstream skill.

Format: newest first. Group under a version heading. Include date.

---

## 0.1.19 — 2026-05-01 — Content resilience: length × viewport × locale

Recurring polish miss in product QA: text behavior under length and space variation. The existing Content Resilience section in `spacing-layout.md` had the CSS techniques but not the review methodology. This expansion turns it from snippets into an audit framework.

### Added
- **3-axis framing** in the section intro — length (1 char to 200), viewport (360px to 1920px+), locale (text expands across languages). Surfaces only pass when no single axis breaks the layout.
- **Decision matrix** mapping surface type to text behavior (truncate / wrap / break-anywhere / never truncate). The audit answer for "what should this text do here" is now a lookup, not a judgement call.
- **Discoverability rule** — truncated identifying or actionable content (names, IDs, amounts, errors) must expose the full value via tooltip, click-to-expand, or detail panel. Decorative truncation can drop without recovery.
- **Audit matrix** replacing the old "test 3 chars vs 200 chars" line. Now tests combinations across length × viewport × locale, with explicit failure modes (layout breaks, silent info loss, over-truncation).
- **Locale expansion budget** — static labels need 30–50% headroom (FR ~+25%, DE ~+50% vs EN). Width planning anchored on the longest expected locale.
- One CSS snippet added: `[overflow-wrap:anywhere]` as a last resort for unbreakable strings that defeat `break-words`.

### Why
Text behavior is a recurring QA failure that nothing in the skill explicitly audited. Reviews caught the symptoms (weird wrap, silent truncation) without naming the rule. This makes the audit deliberate.

---

## 0.1.18 — 2026-04-29 — FLIP, scroll-linked motion, blur ordering

Three additions to `motion.md` after reviewing the `fixing-motion-performance` skill. Two other skills (`interface-design`, `baseline-ui`, `redesign-existing-projects`) were reviewed in the same pass and rejected — already covered or out of scope.

### Added
- `references/motion.md > Performance` — new bullet on reaching for blur last (try `opacity`/`translate` first, blur is paint-heavy). Existing `backdrop-blur` bullet extended with the cap rule (~8px max, never on large surfaces, never in loops).
- `references/motion.md > Performance` — new sub-section *FLIP for layout-like motion*. Covers the measure-first / animate-via-transform pattern for reorder, expand, and reflow effects. Includes the "batch reads before writes" rule to avoid synchronous reflow.
- `references/motion.md` — new top-level section *Scroll-linked Motion*. Two rules: prefer Scroll/View Timelines over `scroll` listeners (compositor vs main-thread), and use IntersectionObserver to pause looping motion when off-screen.

### Sources
- `fixing-motion-performance` skill — FLIP pattern, scroll timeline preference, blur ordering and cap.

---

## 0.1.17 — 2026-04-27 — Tame native scrollbars

Default OS scrollbars on inset containers (sidebars, modal bodies, command menus, dropdowns) read as "design stopped at the container edge." Two CSS rules fix it and tie scrollbars into the design system.

### Added
- `references/spacing-layout.md` — new *Tame Native Scrollbars* section, sibling to the existing *Scrollbar Gutter* rule. Leads with the standards `scrollbar-width` + `scrollbar-color` two-liner using a token (`var(--border)`), not hardcoded gray. Notes the scope rule (inset containers only, leave the document scrollbar alone) because thin scrollbars are harder to grab on long-form pages. Webkit prefixed fallback included for codebases that still support pre-2024 Safari, but framed as optional rather than canonical.
- `references/anti-patterns.md` — one-line entry flagging default-styled scrollbars on inset containers as a polish miss, pointing at the spacing-layout reference.

### Sources
- [@raunofreiberg](https://x.com/raunofreiberg/status/2048057305439039535) — the standards two-liner
- [@iamncdai](https://x.com/iamncdai/status/2048387918868443145) — token-bound Tailwind/shadcn variant

### Why this version (and not 0.1.14)
Version bumps 0.1.14, 0.1.15, 0.1.16 happened in absorption PRs (#5, #6, #7) without changelog entries. SKILL.md frontmatter was also lagging at 0.1.13. Both files realigned to 0.1.17 here.

---

## 0.1.13 — 2026-04-21 — Full Audit Contract + proactive walkthrough offer

Tightens what `cami-design` is accountable for when invoked as the top-level skill, and makes walkthrough mode discoverable instead of hidden behind a keyword.

### Added
- **Full Audit Contract** section in `skills/cami-design/SKILL.md`: the top-level `cami-design` invocation must run all three sub-skills (layout, interaction, copy), load conditional references based on what the target contains, cover a fixed list of surfaces (desktop, narrow viewport, modals, error paths, empty states, loading, keyboard, screen reader signals), and open every review with a **Scope preamble** declaring what was audited and what was explicitly skipped.

### Changed
- Walkthrough mode is now proactively offered at the end of every review via `AskUserQuestion`, with natural, varied phrasing, instead of a single boilerplate sentence. Intent-based triggering still applies when the user signals it earlier.

### Why
First real test of `cami-design` on a live product page produced a partial review that skipped keyboard, a11y, error states, modals, and mobile, without flagging the gaps. The skill described output format but not coverage obligations. Walkthrough mode existed but was invisible unless the user knew the phrasing. Both addressed here.

---

## 0.1.12 — 2026-04-21 — Forms, mobile/touch, typographic characters, dark-mode native UI, content resilience

Large absorption pass from Vercel Labs `web-interface-guidelines`.

### Added
- **New `references/forms.md`** — input attributes (`autocomplete`, `type`/`inputmode`, `spellcheck`), don't-block-paste, label patterns (inc. checkbox/radio hit target), submit behavior (don't pre-disable, disable during request), inline errors with focus-first, placeholder ellipsis + example patterns, unsaved-changes warnings. Wired into parent SKILL's references table, `cami-design-interaction`, and `cami-design-copy`.
- `references/interaction.md` — new *Mobile & Touch* section (`touch-action: manipulation`, `-webkit-tap-highlight-color`, `overscroll-behavior: contain`, drag selection/`inert`, `autoFocus` rules). New loading minimum-duration rule (show-delay + min visible time).
- `references/typography.md` — new *Typographic Characters* section (`…` vs `...`, curly quotes, `&nbsp;` for glued terms). Added `preconnect` bullet for font/asset CDNs.
- `references/color.md` — new *Native Browser UI* section (`color-scheme`, `<meta name="theme-color">`, Windows `<select>` bg/color fix).
- `references/spacing-layout.md` — new *Safe Areas* section (`env(safe-area-inset-*)` for mobile notch), new *Content Resilience* section (truncate/line-clamp/break-words + `min-w-0` flex gotcha + UGC resilience), new *Anchored Headings* section (`scroll-margin-top` under sticky headers).
- `references/motion.md` — SVG Safari transform fix (`transform-box: fill-box` on `<g>` wrapper).

### Deliberately skipped
- Forms sub-skill (too heavy — chose reference-only)
- URL-as-state, deep-linking, hydration, i18n — architectural, out of scope for polish
- Image/CLS rules — engineering scope
- Title Case headings — conflicts with existing sentence-case default in `cami-design-copy`

### Sources
- vercel-labs/web-interface-guidelines (command.md, full rule set reviewed)

---

## 0.1.11 — 2026-04-20 — Modern CSS polish primitives

### Added
- `references/spacing-layout.md` — `scrollbar-gutter: stable` section. Prevents horizontal content shift when scrollbars appear in modal bodies, side panels, dynamic containers. Baseline since 2023, zero cost on overlay-scrollbar platforms.
- `references/motion.md` — `interpolate-size: allow-keywords` + `calc-size()` subsection under *Advanced Techniques*. Enables `height` / `width` transitions to/from `auto`, replacing the `max-height: 9999px` workaround. Chrome 129+, Safari 18.2+, Firefox pending — safe as progressive enhancement.
- `references/color.md` — `::selection` section. Branded selection tint via relative color syntax (`oklch(from var(--color-accent) …)`).

### Sources consulted
- MDN web docs, developer.chrome.com, webkit.org — modern CSS baseline/shipping features reviewed for polish-layer fit.
- Other candidates reviewed and rejected: `field-sizing: content` (would require new *Forms & Inputs* section — structural expansion out of scope), `font-optical-sizing: auto` (browser default in most cases, marginal), scroll-driven animations, View Transitions API, container queries, `color-mix()`, `@scope`, scroll-state queries.

---

## 0.1.10 — 2026-04-20 — Elevation consistency rule

### Added
- `references/spacing-layout.md` — "pick one elevation treatment per hierarchy level" principle added to the *Shadows Over Borders* section. Guards against mixing shadow-recipe cards with flat-border cards in the same list.

### Sources consulted
- `zenobi-us/dotfiles` — `basic-design-principles` skill (depth & elevation strategy section). The single absorbed rule; other candidates reviewed and rejected as already-covered, too narrow, or upstream of polish scope.
- `wondelai/skills` — reviewed, nothing absorbed (strategic/foundational scope misalignment with polish layer).
- `shovonsheikh/saas-ui-master` — reviewed, nothing absorbed (design-system generator, orthogonal to polish layer).

---

## 0.1.6 — 2026-04-20 — Naming, evals, npm

### Changed
- Renamed sub-skills to `cami-design-layout`, `cami-design-interaction`, `cami-design-copy` for clear hierarchy in the command picker.
- Sharpened all four skill descriptions to be action-oriented with "use when" framing.

### Added
- npm package `cami-design` — `npm install -g` links all skills automatically.
- `postinstall` / `preuninstall` scripts for safe symlink management with `.bak` backup on conflict.
- Eval corpus: 10 seed cases covering side-stripe border, AI slop loading copy, passive voice errors, missing hover states, ease-in on enter animations, missing `prefers-reduced-motion`, inconsistent spacing, alpha color overuse, `disabled` vs `aria-disabled`, vague confirmation dialogs.
- Eval runner (`scripts/eval.js`) with LLM-as-judge scoring. Run with `npm run eval`.

### Fixed
- SPDX-License-Identifier header in LICENSE so GitHub detects Apache 2.0 correctly.

---

## 0.1.0 — 2026-04-20 — Initial scaffold

First version. Architecture inspired by pbakaus/impeccable's parent/child pattern and anthropics/skill-creator's meta structure.

### Added
- Parent skill `cami-design` with context-gathering protocol, mode router, shared principles, review output format.
- Sub-skill `layout` — alignment, sizing, spacing, hierarchy.
- Sub-skill `interaction` — animation decision framework, feedback, motion.
- Sub-skill `copy` — clarity, actionability, empty states, tone.
- References: typography, spacing-layout, motion, interaction, color, accessibility, anti-patterns, craft.
- Libraries: easing-curves (populated), palettes + font-pairings (empty placeholders).
- Empty eval corpus at `evals/evals.json`.

### Sources consulted
- `anthropics/skills/skills/frontend-design` — minimal SKILL.md pattern
- `anthropics/skills/skills/skill-creator` — progressive disclosure, eval loop, scripts pattern
- `pbakaus/impeccable` — parent/child architecture, review table format, context protocol, topical references
- `emilkowalski/skill` — animation decision framework, taste philosophy, review format
- `jakubkrehel/make-interfaces-feel-better` — concentric radius, tabular numbers, scale-on-press, image outlines, micro-detail principles
