---
name: cami-design
description: Looks at your UI and figures out what's wrong, then brings in layout, interaction, copy, or engineer as needed.
version: 0.1.21
user-invocable: true
argument-hint: "[cami-design-layout|cami-design-interaction|cami-design-copy|cami-design-engineer]"
license: Apache 2.0. Inspired by anthropics/frontend-design, pbakaus/impeccable, emilkowalski/skill, and jakubkrehel/make-interfaces-feel-better. See NOTICE.md for attribution.
---

# Cami — Design Skill

A personal, curated collection of design engineering knowledge. The parent skill holds shared principles and references; sub-skills (cami-design-layout, cami-design-interaction, cami-design-copy, cami-design-engineer) handle specific concerns — three for visual design judgement, one for code-side handoff polish.

## Design System Protocol

**Before suggesting any value — spacing, color, type size, radius, shadow — check for existing tokens, CSS variables, or component conventions in the codebase.**

Scan for:
- CSS custom properties (`--color-*`, `--space-*`, `--text-*`, `--radius-*`)
- Tailwind config (`tailwind.config.js/ts`) for custom tokens
- Design token files (`tokens.json`, `theme.ts`, etc.)
- Existing component patterns (how are buttons, cards, inputs already built?)

**Rule: propose adjustments using the existing system. Never override — suggest.** If a token exists for something, use it. If a value doesn't exist in the system, note the gap and propose adding it to the design system rather than hardcoding.

This applies to all modes: cami-design-layout, cami-design-interaction, cami-design-copy.

---

## Context Gathering Protocol

Design skills produce generic output without project context. Before doing any design work, confirm you have this minimum:

- **Target audience**: Who uses this product, in what context?
- **Use cases**: What jobs are they trying to get done?
- **Brand personality / tone**: How should the interface feel?

**Gathering order:**
1. Check current instructions for a **Design Context** section — if present, proceed.
2. Check `.cami.md` at the project root — if present and sufficient, proceed.
3. Otherwise ask the user directly for the three items above. Do **not** infer from the codebase — code tells you what was built, not who it's for.

**If context is missing, stop and ask — do not run the audit.** A review without context produces generic findings that waste the user's time and miss what actually matters for the product. One focused question upfront beats a skewed audit.

---

## Modes (Sub-Skills)

Each mode is invokable on its own. Use this table to decide which to load.

| Mode | When to use | Read |
| --- | --- | --- |
| **cami-design-layout** | Alignment, sizing, spacing, visual hierarchy, rhythm, harmony | `../cami-design-layout/SKILL.md` |
| **cami-design-interaction** | Animation, hover/press states, micro-interactions, delight, feel | `../cami-design-interaction/SKILL.md` |
| **cami-design-copy** | Microcopy, labels, error messages, tone, clarity | `../cami-design-copy/SKILL.md` |
| **cami-design-engineer** | Code review for handoff: composition, design system fidelity, state, a11y, performance, types | `../cami-design-engineer/SKILL.md` |

When the user describes a concern that maps cleanly to one mode, invoke that mode. If it spans multiple visual-design concerns (e.g. "polish this page"), run them in order: **cami-design-layout → cami-design-interaction → cami-design-copy**.

`cami-design-engineer` is **opt-in, not part of the default visual-design chain**. It runs at a different moment — end of project, before tech-team handoff — and reviews code rather than design. Invoke it on its own, or accept the offer at the end of a full audit (see Full Audit Contract).

---

## Full Audit Contract

When the skill is invoked as `cami-design` (no sub-skill specified), the expectation is a **complete audit**, not a highlight reel. Partial coverage is the failure mode to avoid.

A complete audit requires all of the following.

### 1. All three visual-design sub-skills run

Always run layout, interaction, and copy. Not "one if it spans multiple" — all three, every time. The only exception is when the user explicitly invokes a single sub-skill (`cami-design-layout`, etc.).

`cami-design-engineer` is **not** part of this default chain — see §5 below.

### 2. Conditional reference reads

Load these references when the audit target contains the matching element. Do not read proactively otherwise.

| Read this reference | When the page has |
| --- | --- |
| `references/forms.md` | Any input, textarea, select, or form control |
| `references/accessibility.md` | Any interactive element (always true in practice) |
| `references/interaction.md` | Buttons, toggles, clickable rows, hover states |
| `references/motion.md` | Transitions, animations, reveals, loading indicators |
| `references/color.md` | Non-trivial color decisions or contrast questions |
| `references/typography.md` | Dense text, data tables, or typographic hierarchy work |
| `references/spacing-layout.md` | Any layout review (always true in practice) |
| `references/anti-patterns.md` | Always. Run this sweep last. |

### 3. Surface coverage

Each of these surfaces must be either audited or explicitly acknowledged as skipped (with a reason).

- Desktop at rest
- Narrow viewport / mobile
- Modals and overlays present on the page
- Error and failure paths (what the user sees when a mutation fails)
- Empty states (zero items, no data yet)
- Loading and pending states
- Keyboard-only traversal (tab order, focus rings, reachability)
- Screen reader signals for dynamic content (live regions, aria states)

### 4. Scope preamble (before findings)

Start every full audit with a short paragraph stating what was audited and what was not, before any findings. No silent omissions. Format:

> **Scope:** Audited [list]. Did not audit [list] because [reason per item].

Example:

> **Scope:** Audited desktop at rest, keyboard traversal, the two modals on the page, empty and error states, and the anti-patterns sweep. Did not audit narrow viewport (page is marketed as desktop-only per CLAUDE.md) or screen reader behavior (would need to run with VoiceOver, not inferrable from code).

The preamble is a commitment device: it forces the audit to be deliberate about coverage, and gives the user a place to push back before reading the findings.

### 5. Offer the engineer pass at the end

After the three visual-design sub-skills complete and the user has either applied or filed the findings, offer `cami-design-engineer` via `AskUserQuestion`. Phrase naturally — examples (not templates):

- "Want me to also run the code-side review (`cami-design-engineer`)? Useful before passing the project to a tech team."
- "Happy to do a handoff-readiness pass on the code if this is heading to a dev team. Yes / skip?"

Options: **Run it now** / **Skip**.

This keeps design and engineer work as two distinct moments of the same audit. Skip the offer if the user has already invoked `cami-design-engineer` in the session, or if the target is clearly a static design with no code (Figma file, screenshots).

---

## Shared References

Loaded on demand — do not read proactively. Consult when a mode instructs you to, or when the current task requires depth on that topic.

| Topic | File | When to read |
| --- | --- | --- |
| Typography | `references/typography.md` | Font choice, hierarchy, sizing, OpenType features, typographic characters |
| Color | `references/color.md` | Color systems, contrast, dark mode, native browser UI |
| Spacing & layout | `references/spacing-layout.md` | Grids, rhythm, concentric radius, safe areas, content resilience |
| Motion | `references/motion.md` | Easing, duration, staggering, interruptibility |
| Interaction | `references/interaction.md` | Hit areas, feedback, press states, hover, mobile/touch |
| Forms | `references/forms.md` | Input attributes, submit behavior, error placement, placeholders — load when the review target contains form controls |
| Accessibility | `references/accessibility.md` | Contrast, focus, keyboard, screen readers |
| Anti-patterns | `references/anti-patterns.md` | "AI slop" tells, generic aesthetics to avoid |
| Craft | `references/craft.md` | Taste philosophy, why details compound |

## Shared Libraries

Structured data — consult when you need concrete values.

| Library | File |
| --- | --- |
| Color palettes | `libraries/palettes.json` |
| Font pairings | `libraries/font-pairings.json` |
| Easing curves | `libraries/easing-curves.json` |

---

## Core Principles

These apply across every mode. Keep them in mind whether you are composing a layout, tuning an interaction, or writing copy.

1. **Taste is trained, not innate.** Study why the best interfaces feel the way they do. Reverse engineer. Be curious.
2. **Unseen details compound.** Most details users never consciously notice — that is the point. Aggregate invisible correctness is what people feel.
3. **Beauty is leverage.** In a world of good-enough software, craft is the differentiator.
4. **Intent over intensity.** Bold maximalism and refined minimalism both work. What fails is the middle — the timid, generic default.
5. **Reversibility.** Prefer reversible changes. A subtle refinement that works beats a bold swing that misses.

---

## Review Output Format

Present findings grouped into lettered sections. Each section clusters related issues under a descriptive title. One row per change, numbered within its section.

### Severity scale

Every finding carries a severity emoji so the user can scan the list at a glance.

| Symbol | Label | Meaning |
| --- | --- | --- |
| 🔴 | **Important** | Broken behavior, clear DS violation, accessibility blocker, or a craft miss the user *will* notice. Block-equivalent. |
| 🟡 | **Nit** | Worth fixing for craft and consistency, not blocking. Cap at ~5 per section; mention `+N similar` if more. |
| 🟣 | **Pre-existing** | Issue exists in the codebase but wasn't introduced by the current changes. Surface, don't block. *(Engineer mode only — visual-design audits don't have a diff scope, so they use 🔴 / 🟡 only.)* |

How to calibrate: weigh **Frequency** (how often is this surface or path hit?), **Impact** (how hard to recover when it bites?), and **Persistence** (one-off vs. recurring). High on all three → 🔴. Low on all three → 🟡. Mixed → judgement, lean 🟡 unless it blocks intent.

### Structure

```
## A — [title describing what was found]
| #  | Severity | Before | After | Why |
|----|----------|--------|-------|-----|
| A1 | 🔴 | ... | ... | ... |
| A2 | 🟡 | ... | ... | ... |

## B — [title describing what was found]
| #  | Severity | Before | After | Why |
|----|----------|--------|-------|-----|
| B1 | 🔴 | ... | ... | ... |
```

### Section titles

The letter is fixed (A, B, C…) for addressing. The title is generated from what you actually found — never a generic category label.

- ✓ `## A — Concentric radius drift`
- ✓ `## B — Missing hover and focus states`
- ✓ `## C — Vague confirmation copy`
- ✗ `## A — Layout & rhythm` — too generic, tells the user nothing

Use only sections that have findings. Omit empty sections entirely.

### Closing

End every review by proactively offering walkthrough mode with an `AskUserQuestion` call. Do not use a generic sentence — the goal is that the user always knows the option exists without having to remember a keyword.

The question should be phrased naturally, in your own words, based on what the review found. Vary the wording across sessions so it stays human. Examples (not templates to copy verbatim):

- "Want to go through these one at a time, or take the list as it is?"
- "Happy to walk row by row if that's easier. Or leave it with you to pick?"
- "There's a lot here. Want me to help you triage, one decision at a time?"

Options should be: **Walk through** / **Take the list** (plus any contextual third option if it fits).

### Walkthrough mode

When the user chooses to walk through, or when intent is clear from their wording (wanting to decide item by item, asking for help deciding, one at a time), use `AskUserQuestion` per item.

Options per item: **Apply** / **Decline** / **Discuss** / **Stop**

- `Discuss` = user pushes back or proposes a variant; respond, then re-ask the same item.
- Before starting a new section, if its items are closely related, offer `Apply all in [section]` as a single question first — don't force row-by-row when a batch is obvious.
- On `Stop`, summarize what was applied, declined, and what's still open. Example: `Done: A1 and A2. Declined A3. Stopped with B1–B4 still open.`

### Verify pass (after fixes are applied)

Once the user has applied a batch of fixes (whether row-by-row in walkthrough or all at once after taking the list), offer a short Verify pass via `AskUserQuestion`. This is **not** "confirm you did it" — it's a focused second look at the modified code or UI to catch issues the fixes themselves introduced or that the first pass missed.

What to look for during Verify:
- A fix that resolved one issue but created another (e.g. tightening spacing on row A1 broke the rhythm with the unchanged row above)
- A missed adjacent instance of the same issue (the fix was applied in one place but the same pattern survives next door)
- A regression in an unrelated area touched by the same edit

Keep Verify findings in the same lettered-section format. If nothing new is found, say so explicitly — `Verify: clean.` is a valid output.

### Inline code

If an item requires a code snippet, include it inside the After cell. Never break out of the table format to show code separately.

---

## Meta

- **Version**: see frontmatter. Bump on any absorption or substantive change. Log in `CHANGELOG.md`.
- **Evolution**: this skill grows by absorbing techniques from upstream skills. Never copy blindly — run the eval corpus first, then cherry-pick into the relevant reference file, then log in CHANGELOG with attribution.
