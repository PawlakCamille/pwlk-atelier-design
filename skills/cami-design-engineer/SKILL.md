---
name: cami-design-engineer
description: Composition, design system fidelity, state, a11y, performance, types. Use at the end of a project to polish the code before tech-team handoff.
user-invocable: true
argument-hint: "[target]"
metadata:
  version: 0.1.0
---

## MANDATORY PREPARATION

Invoke `cami-design` — it contains the shared principles, references, and **Context Gathering Protocol**. Follow the protocol before proceeding.

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

Work through these systematically. Each finding goes into the `Before | After | Why` table format defined in **Output**. Skip dimensions with no findings.

### Component Composition

- **Boolean prop sprawl.** Three or more on/off flags on a single component (`isLarge`, `isOutlined`, `hasIcon`, `isLoading`). Replace with an explicit `variant` prop, or split into composable sub-parts using the compound pattern (`<Tabs><Tabs.List><Tabs.Trigger /></Tabs.List></Tabs>`).
- **Render props where `children` would do.** A function-as-prop that returns JSX (`renderItem`, `renderHeader`). Pass children directly unless the parent must control the loop (virtualization, recursion).
- **`forwardRef` in React 19+ code.** React 19 makes `ref` a normal prop, so the wrapper is no longer needed. Drop the `forwardRef(...)` call.
- **Fetch and render in the same file.** Data-loading and presentation tangled together: hard to test, hard to reuse. Split into a container that fetches and a pure component that displays.
- **Same JSX shape in 3+ files.** Extract to a shared component. Two occurrences? Leave it — premature abstraction is worse than duplication.
- **State scattered across siblings.** Two sibling components both manage a piece of the same UI state via prop drilling or duplicated `useState`. Lift the state into a parent provider; children read it via context.
- **Children know how state is stored.** A compound component where `<Tabs.Trigger>` imports a Zustand store directly or references `useReducer`. The provider should expose a stable interface (`{ state, actions }`); children only consume it.
- **Context exposes raw setters instead of intent.** Context value with `setActiveTab`, `setOpen`, `setValue` instead of `select`, `toggle`, `change`. Refactor to a `{ state, actions, meta }` shape so the provider can be swapped for testing or a different state lib.

### Design System Fidelity

- **Hardcoded values where a token exists.** `bg-[#xxx]`, `text-[14px]`, `gap-[13px]`, inline `style={{ color: '...' }}`. Replace with the matching token (`bg-primary-100`, `text-body-13`, `gap-3`).
- **DS component next to a hand-rolled equivalent.** A DS `Button` and a raw `<button>` in the same view. Pick the DS one.
- **DS primitives imported from the wrong path.** Import from the canonical entry (`@/components/ui/design-system`), not the legacy folder.
- **New token introduced inline.** A one-off color or spacing value used in code that isn't in the DS. Flag as a gap to add to the DS file rather than hardcoding.
- **`cn()` overrides on a DS variant.** Conditional classes that fight the DS defaults. Use the variant prop the DS already exposes.
- **Generic Tailwind utilities where the project has a typed scale.** `font-bold`, `text-sm` on a project that defines `text-body-13`, `text-heading-24`. Use the typed scale.

### State & Data Flow

- **Async work in `useEffect` without cleanup.** A fetch that fires, then the component unmounts before it resolves. Use `AbortController` for fetch, or an `ignore` flag for other async work, and return a cleanup function.
- **API call on every keystroke.** Search inputs, filters, anything user-typed that triggers a request. Add a debounce (~300ms is the common default).
- **State only read inside callbacks but subscribed at render.** Causes re-renders the component doesn't need. Read the value via a ref or move the read inside the callback.
- **Object or array dependencies in effects.** Triggers the effect on every render because the reference is new. Depend on primitive fields (`user.id`, not `user`), or memoize the object.
- **Derived state stored as state.** A value that can be computed from existing state, kept in a separate `useState`. Compute it inline; don't double-track.
- **Race conditions on rapid input.** Two requests fired in close succession, the slower one wins and overwrites the faster. Track the latest request id, or abort the previous one.
- **Stale state in `setState`.** `setCount(count + 1)` reads a stale `count` if multiple updates fire close together. Use the function form `setCount(prev => prev + 1)` whenever the new value depends on the previous.
- **`.sort()` on React state.** `.sort()` mutates the source array, so the state changes silently and React doesn't re-render. Use `[...arr].sort()` or `arr.toSorted()`. Same trap with `.reverse()` and `.splice()`.
- **Independent requests fired sequentially.** Two `await`s in a row that don't depend on each other run one after the other. Wrap in `Promise.all([...])` so they run in parallel.
- **Same endpoint fetched independently in multiple components.** Each component fires its own request for the same data. Use a request library that dedupes by key (React Query, SWR), or lift the fetch into a shared parent.
- **Mutating props inside a component.** `user.lastViewed = new Date()` inside a component modifies data the parent owns — bugs propagate sideways and React doesn't see the change. Treat props as read-only. If something must change, notify the parent via a callback (`onView(user.id)`) and let it update its own state.

### A11y Implementation

- **`<div onClick>` instead of `<button>`.** A `<div>` is not focusable, not keyboard-operable, not announced as interactive. Use `<button>` (or add `role="button"` + `tabindex="0"` + Enter/Space handlers if the element must stay a `<div>`).
- **Icon-only button without an accessible name.** Screen readers say "button" with no context. Add `aria-label` or a visually-hidden text label.
- **Form input not linked to a label.** No `<label htmlFor>`, no `aria-labelledby`, no `aria-label`. Wire one of the three.
- **Decorative icon read aloud, or content image with no alt.** `<img>` without `alt`, or a decorative icon without `aria-hidden="true"`. Add the right attribute.
- **Modal missing focus management.** No focus trap, no initial focus, no `aria-modal`. Use a tested dialog primitive (Radix, Headless UI, the project's DS) rather than rolling your own.
- **Color-only signal.** Red text to mean "error", green dot to mean "online". Add a text label, an icon, or `role="alert"` so the meaning isn't lost without color.
- **Custom interactive element missing keyboard handlers.** A clickable div, a custom select, a draggable item. Wire Enter/Space for actions, arrow keys for menus and lists.

### Performance & Rendering

- **Array index used as React `key`.** Causes wrong items to update when the list reorders, filters, or has insertions. Use a stable id from the data.
- **Static JSX or constants created inside the component body.** A constant array, an inline `<svg>` recreated on every render. Hoist outside the component.
- **Heavy component loaded eagerly.** A chart library, a rich-text editor, a markdown renderer always in the bundle even when the feature isn't used. Lazy-load with `lazy()` / `dynamic()`.
- **Barrel imports pulling in more than needed.** `import { Button } from '@/components/ui'` where the barrel re-exports 30 components. Import directly when bundle size matters.
- **Missing `memo` on a component inside a hot list.** Only flag if the list is large and the component receives stable props. Don't memoize speculatively — premature `memo` adds noise.
- **`{value && <Component />}` where `value` can be `0` or `''`.** React renders the falsy value instead of skipping. Use a ternary: `{value ? <Component /> : null}`.
- **Animation applied to the `<svg>` element.** Animating the SVG itself is expensive; animate a wrapper `<div>` or use CSS `transform` on the wrapper.
- **Expensive computation in `useState` initial value.** `useState(buildBigList())` runs `buildBigList()` on every render even though only the first call matters. Pass a function: `useState(() => buildBigList())`.
- **Heavy state update blocking the input.** Filtering a 10k-row list on every keystroke freezes the field. Wrap the heavy update in `startTransition(() => setFiltered(...))` so React keeps typing responsive and updates the list when it can.
- **Same global listener attached in many components.** Multiple components each call `window.addEventListener('scroll' / 'resize' / 'keydown')`. Memory leak risk and duplicated work. Centralize in one custom hook with subscriber callbacks, or attach once at the app root.
- **`.includes()` or `.find()` on a large array in a hot loop.** O(n) lookup repeated for every item is O(n²). Build a `Set` (membership) or `Map` (key→value) once, then look up in O(1).

### Type Safety & Code Clarity

- **`as any`.** Hides a type error rather than fixing it. Narrow with `unknown` + a type guard, or fix the source type.
- **`interface` for component props if the project uses `type Props`.** Stay with the project convention. Mixed styles look unintentional.
- **Manual annotations where inference would do.** `const count: number = items.length` — the type is obvious. Drop the annotation.
- **Barrel files in a project that avoids them.** New `index.ts` re-export added where the convention is direct imports.
- **Comments explaining what the code does.** Delete. Keep only comments that explain *why* a non-obvious choice was made (a workaround, a constraint, an invariant).
- **Magic numbers.** A `7` or `0.85` in the middle of code with no name. Extract to a named constant.
- **Files / directories not in kebab-case.** If the project convention requires kebab-case, rename. Mixed casing causes import friction across OSes.
- **`function foo()` declarations where the convention is arrow functions.** Stay consistent with the project's existing style.
- **Untested business logic.** Hooks, utilities, or pure functions with branching logic (calculations, conditionals, state machines) and no test file. Don't write the tests yourself, but flag what the tech team should cover, e.g. `"calculateDiscount has 3 branches — needs tests for zero-quantity and expired-coupon cases"`.

## Output

### Severity scale

- 🔴 **Important.** A bug, broken behavior, broken a11y, or a DS-token violation that ships an inconsistent UI. Block handoff.
- 🟡 **Nit.** Worth fixing for craft and maintainability. Not blocking. Cap at **5 per dimension**; report `+N similar` in the tally if more.
- 🟣 **Pre-existing.** Exists in the codebase but not introduced by the current changes. Surface, don't block.

**How to calibrate severity.** Three factors decide whether a finding is Important or Nit:

- **Frequency.** How often does the affected code path run? A bug in the main app shell hits every user; a bug in an admin-only edge case hits a few.
- **Impact.** How hard is it to recover when the bug fires? Easy workaround → Nit. User loses data, gets stuck, or sees broken UI → Important.
- **Persistence.** One-off cosmetic glitch vs. recurring problem on every render. The recurring one is heavier.

A finding that scores high on all three is Important. Low on all three is Nit. Mixed → use judgement, lean Nit unless it blocks handoff.

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

End with the standard walkthrough offer (`AskUserQuestion`, options **Walk through** / **Take the list**) per the parent skill `Review Output Format → Closing` section.

## NEVER

- Flag formatting / lint / type-error issues — CI does that.
- Flag findings in generated files (`*.gen.ts`, `dist/`, `build/`), lockfiles (`*.lock`, `package-lock.json`), or vendored dependencies (`node_modules/`, `vendor/`).
- Flag in test files when the violation is intentional (mocks, fixtures, edge-case scenarios).
- Flag without a `file:line` citation.
- Suggest abstractions for code that appears fewer than 3 times.
- Refactor for hypothetical future requirements.
- Add comments explaining what well-named code already shows.
- Post more than 5 nits per dimension — summarize the rest as `+N similar`.
- Surface new nits on a re-review pass; only Important findings the second time around.
- Re-do design judgement (spacing, motion, copy) — that belongs in the other three sub-skills.

## References

- **Anthropic Code Review** — severity model, verification bar, re-review convergence: https://code.claude.com/docs/en/code-review
- **Vercel Composition Patterns** — boolean prop refactor, compound components, lifted state, React 19 APIs: https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns
- **Vercel React Best Practices** — re-render, rendering, bundle, JS perf rules: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
- `../cami-design/references/accessibility.md` — a11y depth (contrast, focus, screen readers)
- `../cami-design/references/anti-patterns.md` — generic / "AI slop" tells, some apply at code level
