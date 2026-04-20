# Changelog

Track every absorption, addition, and substantive change. Each entry cites source when material came from an upstream skill.

Format: newest first. Group under a version heading. Include date.

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
