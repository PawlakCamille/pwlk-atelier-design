---
name: cami-design-engineer
description: Composition, DS fidelity, state, a11y, perf, types. Use before handoff to a tech team or for a senior front-end code review.
user-invocable: true
argument-hint: "[target]"
---

# Cami — Engineer

## Required reading

Before proceeding, load `../cami-design/SKILL.md` and apply its **Context Gathering Protocol**, **Design System Protocol**, **Severity scale**, and **Review Output Format**. Loading is not a recursive `/cami-design` invocation — just read the shared rules, then continue here.

---

A code review for design engineers, not for engineers. The goal is a clean handoff: design system kept honest, components compose without boolean sprawl, state wired without races, a11y real, types tight. Replaces the usual stack of `/review` + composition-pattern review + "review this like a senior FE" prompts.

## When to Use This Mode

- End of a project, before the tech team takes it over
- A polish pass on a vibe-coded prototype that "works but isn't ready to ship"
- The same JSX shape shows up in 3+ files and needs consolidating
- You want one pass that covers composition, design system, state, a11y, perf, and types

This skill reviews **code**. For visual judgement (spacing, motion, copy), use `cami-design-layout`, `cami-design-interaction`, or `cami-design-copy`.

## Preparation

1. Read `package.json` to identify the framework and version. React 18 vs 19 changes some rules (`forwardRef`, `use()`).
2. Read the linter/formatter config (biome, eslint, prettier). **Skip anything CI already enforces.**
3. Locate the design system: tokens file, Tailwind config, DS components directory, any `DESIGN.md`.
4. Check type strictness: `tsconfig.json`, project convention on `type` vs `interface`, presence of `as any`.
5. Scope to changed code by default (`git diff <base>...HEAD`). Exclude generated files, lockfiles, vendored dependencies, and test fixtures. Full-file review only if the user asks.
6. If the diff exceeds ~400 changed lines (excluding generated and lockfiles), ask the user to scope the review by feature or file before continuing. Wide reviews lose signal.
7. If the project has an E2E test suite (`e2e/`, `playwright/`, `cypress/`…), grep it for `data-testid` selectors before flagging refactors. Removing or renaming a referenced testid breaks the test silently. Note any testid changes in the review.

## Check Codebase Precedent First

Before flagging anything as "should be X", search the repo for existing implementations of the same need. The most common review failure is proposing a "better" version of something the project already has in a different style — that introduces parallel approaches and breaks consistency.

The check, on every finding:

1. **Does the codebase already solve this?** Utilities, hooks, components, state libraries, naming conventions — search before recommending.
2. **If yes, align with what exists.** The finding becomes "reuse X" not "introduce Y."
3. **If the new code diverges from established conventions without an explicit reason, flag the divergence** so the author can decide intentionally rather than by accident.

Especially relevant for: utilities and hooks (`useDebounce`, `cn`, formatters), component patterns (modals, forms, tables), state management style, and file naming conventions.

## Review Dimensions

Six dimensions. Each has a dedicated reference file with the concrete findings to flag. Load a dimension's reference when the diff touches that area; skip dimensions with no signal.

| Dimension | Reference | Load when |
| --- | --- | --- |
| Component Composition | `../cami-design/references/composition.md` | Component shape, prop surface, state location, compound patterns |
| Design System Fidelity | `../cami-design/references/ds-fidelity.md` | New or modified styled components, raw color/spacing values, DS imports |
| State & Data Flow | `../cami-design/references/state.md` | `useState`, `useEffect`, async work, shared data fetching |
| A11y Implementation | `../cami-design/references/a11y-implementation.md` | Any interactive element, form, modal, image, custom widget |
| Performance & Rendering | `../cami-design/references/perf.md` | Lists, memoization, animations, heavy state, hot handlers |
| Type Safety & Code Clarity | `../cami-design/references/typing.md` | TypeScript annotations, file naming, comments, magic numbers |

Each finding goes into the `Before | After | Why` table format defined in **Output**.

## Output

### Severity scale

See parent skill `Review Output Format → Severity scale` for the full table and calibration rules. Engineer mode uses all three symbols:

- 🔴 Important — bug, broken a11y, DS violation that ships inconsistent UI. Block handoff.
- 🟡 Nit — craft and maintainability. Cap at 5 per output section; `+N similar` for the rest.
- 🟣 Pre-existing — issue exists in the codebase but wasn't introduced by the current diff. Surface, don't block.

### Verification bar

Every finding cites `file:line` from the actual code. No flagging based on naming or inference. If you can't point to the line, drop the finding.

### Re-review convergence

Second pass over the same code: suppress new nits, post Important findings only.

### Format

Open with a one-line tally:

> **Tally:** X 🔴 important · Y 🟡 nit · Z 🟣 pre-existing.

If nothing is Important, lead with `No blocking issues for handoff.` before the tally.

Then group findings using the lettered-section format from the parent skill. Title each section from what was actually found, not from the dimension name.

```
## A — Boolean prop sprawl on <Tabs>
| #  | Severity | Before | After | Why |
|----|----------|--------|-------|-----|
| A1 | 🔴 | `<Tabs isVertical isLazy isFitted hasDivider>` (src/views/contacts/tabs.tsx:42) | `<Tabs orientation="vertical" lazy fitted><Tabs.Divider /></Tabs>` | Five boolean props mix orthogonal concerns. A variant prop plus compound parts scales; booleans don't. |
| A2 | 🟡 | … | … | … |
```

Inline code snippets go inside the After cell — never break out of the table.

Close with the walkthrough offer and (after fixes) the Verify pass — see parent skill `Review Output Format → Closing / Walkthrough mode / Verify pass`.

## NEVER

- Flag formatting / lint / type-error issues — CI does that.
- Flag findings in generated files (`*.gen.ts`, `dist/`, `build/`), lockfiles (`*.lock`, `package-lock.json`), or vendored dependencies (`node_modules/`, `vendor/`).
- Flag in test files when the violation is intentional (mocks, fixtures, edge-case scenarios).
- Flag without a `file:line` citation.
- Suggest abstractions for code that appears fewer than 3 times.
- Refactor for hypothetical future requirements.
- Add comments explaining what well-named code already shows.
- Post more than 5 nits per output section — summarize the rest as `+N similar`. (Output sections are the lettered groups A, B, C…, not review dimensions.)
- Surface new nits on a re-review pass; only Important findings the second time around.
- Re-do design judgement (spacing, motion, copy) — that belongs in the other three sub-skills.

## References

The six dimension references are listed in the *Review Dimensions* table above — load each when the diff touches its area. Two shared references also apply:

- `../cami-design/references/accessibility.md` — a11y principles (contrast, focus, screen readers) that pair with `a11y-implementation.md`
- `../cami-design/references/anti-patterns.md` — generic / "AI slop" tells, some apply at code level (`h-screen` → `100dvh`, mixed icon stroke weights, etc.)

External upstream sources (Anthropic Code Review, Vercel Composition Patterns, Vercel React Best Practices) are credited in `NOTICE.md`.
