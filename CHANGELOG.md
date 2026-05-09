# Changelog

Track every absorption, addition, and substantive change. Each entry cites source when material came from an upstream skill.

Format: newest first. Group under a version heading. Include date.

---

## 0.1.23 — 2026-05-09 — Absorb react-doctor into engineer skill

### Added — 6 patterns absorbed from millionco/react-doctor

Audited the full react-doctor rule set (~30 rules) against the existing skill. The majority were already covered or belonged to the visual design sub-skills. Six patterns were genuinely new to `cami-design-engineer`:

- **Inline props defeating memoization** — inline functions, objects, or arrays passed to `memo`'d components silently break the cache on every render.
- **Default `{}`/`[]` prop values on memoized components** — `function Card({ items = [] })` creates a new reference each render; the fix is a module-level constant.
- **`useMemo` on trivial expressions** — wrapping `items.length` in `useMemo` costs more than it saves; clarified when memoization is actually warranted.
- **Nondeterministic values in render body** — `new Date()`, `Math.random()`, `crypto.randomUUID()` cause server/client hydration mismatches in Next.js. Move into `useEffect` or a server context.
- **`setState` in high-frequency handlers** — `scroll`/`mousemove`/`wheel` fire at 60–120Hz; direct `setState` queues a synchronous re-render on every tick. Use `startTransition` or `useDeferredValue`.
- **Framer Motion layout property animation** — `animate={{ width, height, padding }}` forces layout recalculation every frame; use `scaleX`/`scaleY` with `transformOrigin` instead.

Source: [millionco/react-doctor](https://github.com/millionco/react-doctor)

---

## 0.1.22 — 2026-05-09 — Audit pass via skill-creator

Pass through the skill via Anthropic's `skill-creator` surfaced two structural improvements (frontmatter standardization, codebase-precedent rule for the engineer pass) and one structural finding that the description loop validated empirically (the parent `cami-design` description should not be optimized further — see "Description loop findings" below).

### Changed — frontmatter cleanup

`skill-creator`'s validator flagged the custom `version` key as non-standard. Moved into `metadata:` across all five SKILL.md files (`cami-design`, `cami-design-layout`, `cami-design-interaction`, `cami-design-copy`, `cami-design-engineer`).

`argument-hint` and `user-invocable` deliberately kept at top level — both are documented Claude Code skill features. Moving them into `metadata` would silently break slash-command behavior to satisfy a stricter validator. Trade-off accepted.

### Added — Engineer skill: "Check Codebase Precedent First"

New section in `cami-design-engineer/SKILL.md`, between Preparation and Review Dimensions. Before flagging any "should be X", the engineer pass must first search the repo for existing implementations of the same need.

The most common review failure is proposing a "better" version of something the project already has in a different style — introducing parallel approaches and breaking consistency. The new section formalizes the three-step check (does it exist? align with it. flag divergences as intentional choices). Especially relevant for utilities, component patterns, state management style, and naming conventions.

### Changed — three description polishes

After the loop finished, applied three aesthetic improvements to the descriptions even though the loop didn't validate them empirically (the test mechanism turned out to measure slash-command auto-invocation rather than skill registry triggering, so its null result wasn't conclusive).

- **`cami-design`** — adds "before shipping" to anchor the moment of use, swaps "figures out what's wrong" for the more measured "spots what's off". 111 → 101 chars.
- **`cami-design-interaction`** — replaces "button feedback" (slightly engineer-coded) with "press" (more natural designer vocabulary), adds "robotic" as a recognized symptom. 106 → 98 chars.
- **`cami-design-engineer`** — drops "design system fidelity" (was overlapping with the visual sub-skills), replaces with "codebase fit" (ties to the new Codebase Precedent rule), broadens trigger context beyond "end of project". 142 → 103 chars.

`cami-design-layout` and `cami-design-copy` left unchanged — both were already balanced.

### Added — Table of contents on `spacing-layout.md`

The file passed the 300-line threshold (`skill-creator` recommends a TOC for references >300 lines) after the recent absorptions. Flat list of all 15 sections with anchor links at the top so an LLM consulting the reference can scan-and-jump rather than read top-to-bottom.

### Description loop findings (no code change)

Ran `skill-creator`'s description optimization loop on the parent `cami-design` skill (5 iterations, 12-train / 8-test split, 3 runs per query). Result: **no proposed description beat the original**. Recall stayed at 0% across all 5 iterations regardless of phrasing.

The loop confirmed that the parent's triggering issue is structural, not a wording problem: when sub-skills are also installed, queries like "audit my settings panel" route to the most specific sibling (`cami-design-layout` etc.) before reaching the parent. The parent is best invoked explicitly via `/cami-design`, which is already the supported entry path.

Run artifacts in `cami-design-workspace/description-loop/2026-05-09_003308/` (gitignored) for future reference.

---

## 0.1.21 — 2026-05-08 — cami-design-engineer + severity column + Verify pass

Adds a fourth sub-skill for the code-side handoff moment, propagates a severity column across all sub-skills, and introduces a Verify pass to walkthrough mode.

### Added — `cami-design-engineer`

New sub-skill for end-of-project code review before tech-team handoff. Replaces the manual stack of `/review` + composition-patterns + "review like a senior FE" prompts.

Six dimensions:
- **Component Composition** — boolean prop sprawl, render props vs children, `forwardRef` in React 19+, fetch+render coupling, premature abstraction, provider/context patterns (lift state, decouple implementation, context interface)
- **Design System Fidelity** — hardcoded values vs tokens, DS components mixed with hand-rolled, canonical import paths, generic Tailwind utilities where typed scales exist
- **State & Data Flow** — `useEffect` cleanup, debounce, defer reads, primitive deps, derived state, race conditions, functional `setState`, immutable sort, parallel requests, request dedup, props mutation
- **A11y Implementation** — `<div onClick>`, icon-only buttons, label/input wiring, alt/aria-hidden, modal focus trap, color-only signals, keyboard handlers
- **Performance & Rendering** — array-index keys, hoist JSX, lazy load, barrel imports, memoization, falsy-AND, SVG animation, lazy state init, transitions, global listener dedup, Set/Map lookups
- **Type Safety & Code Clarity** — `as any`, props convention, inference, barrels, comment hygiene, magic numbers, file casing, function declaration style, untested business logic flagging

### Added — Severity column across all sub-skills

Every finding now carries a severity emoji:
- 🔴 **Important** — broken behavior, DS violation, a11y blocker, craft miss the user will notice
- 🟡 **Nit** — worth fixing for craft, not blocking; cap ~5 per section
- 🟣 **Pre-existing** — issue exists but wasn't introduced by current changes (engineer mode only — visual-design audits don't have a diff scope)

Calibration documented as **Frequency × Impact × Persistence** in `cami-design/SKILL.md → Review Output Format → Severity scale`. The three visual-design sub-skills reference the parent's scale instead of duplicating the definition.

### Added — Verify pass in walkthrough mode

After fixes are applied, walkthrough now offers a Verify pass: a focused second look at the modified code/UI to catch issues introduced by the fixes themselves or missed adjacent instances. `Verify: clean.` is a valid output.

### Added — Engineer offer at the end of full audit

When `cami-design` runs as a full audit (3 visual-design sub-skills), it now offers `cami-design-engineer` via `AskUserQuestion` at the end. Keeps design and engineer as two distinct moments of the same audit. Skipped when the target is a static design or the engineer skill already ran in the session.

### Sources

- **Anthropic Code Review docs** — severity model, verification bar, re-review convergence, skip rules, summary shape
- **vercel-labs/agent-skills/composition-patterns** (MIT) — 8 of 8 applicable rules
- **vercel-labs/agent-skills/react-best-practices** (MIT) — 17 of 45 rules; Next/SSR-only and micro-opts deliberately skipped
- **wshobson/agents/code-review-excellence** — PR size guard, props mutation
- **mistyhx/frontend-design-audit** — severity calibration framework, Verify step
- **themobilefirstco/desktop-allo CI claude-code-review.yml** — untested business logic flagging, E2E testid awareness

### Reviewed and not absorbed

- `obra/superpowers/requesting-code-review` and `receiving-code-review` (74K + 59K installs) — wrong audience (requester / receiver, not reviewer)
- `wshobson/agents/code-review-excellence` soft-skill content — feedback tone catchphrases skipped per editorial direction
- `onewave-ai/claude-skills/code-review-pro` — backend-flavored security checklist (SQL injection, CSRF) doesn't fit a frontend SPA scope
- `anthropics/knowledge-work-plugins/design-handoff` — different deliverable type (specs generation); flagged as a future 5th sub-skill `cami-design-handoff`
- `vercel-labs/agent-skills/web-design-guidelines` — out of scope
- 28 of 45 vercel-react-best-practices rules — Next-specific (`server-*`, `async-suspense`), SSR (`hydration-no-flicker`), or micro-opt (`js-cache-*`, `js-combine-iterations`, etc.)

---

## 0.1.20 — 2026-05-03 — Motion craft: blur+motion, close-subtlety, animate-inner

Three small craft principles absorbed from `Jakubantalik/transitions-dev` (the agent-skill packaging of the transitions.dev snippet collection).

### Added
- `references/motion.md > Enter Animations` — new bullet: pair small movement with small blur (2-3px). Short translates and scales need a blur companion to read as motion; without it 8px distances feel like nothing happened. Pattern is consistent across the transitions-dev library.
- `references/motion.md > Exit Animations` — new bullet: close on a subtler scale than the open started from (e.g. opens from `scale(0.97)`, closes toward `scale(0.99)`). Exits shouldn't "pop" as much as entrances did.
- `references/motion.md > Specificity` — new bullet: animate the inner piece, not the container. Badge dot, not trigger button. Page sections, not wrapper. The changing thing should be the thing that moves.

### Reviewed and not absorbed
- The 9 transition snippets themselves (card resize, number pop-in, notification badge, text swap, dropdown, modal, panel reveal, page slide, icon swap) — they're a paste-ready library, not polish-layer principles. cami-design's scope is review, not snippet distribution.
- The shared `:root` block with ~50 tuned variables — that's their design system, not a principle.
- The "transition: all" anti-pattern from their Common Mistakes — already in cami's Specificity section.
- The reflow trick (`void el.offsetHeight`) — engineering implementation detail.

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
