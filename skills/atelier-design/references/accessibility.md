# Accessibility

Deep reference. Loaded on demand.

## Contrast (WCAG)

- Body text: ≥ 4.5:1
- Large text (≥ 18.66px or 14px bold): ≥ 3:1
- Interactive element boundaries: ≥ 3:1
- Focus indicators: ≥ 3:1 against adjacent colors

## Focus

- Every interactive element must have a visible focus state.
- Use `:focus-visible` to show rings on keyboard navigation only (not mouse clicks).
- Never `outline: none` without a replacement.
- Focus order follows visual order.
- Focus trap inside modals; restore focus to the trigger on close.

## Keyboard

- Everything interactive reachable via Tab.
- Enter submits forms; Space activates buttons; Esc closes dialogs.
- Arrow keys navigate within composite widgets (menus, listboxes, radio groups).
- Skip-to-content link at top of page for long navigations.

## Screen Readers

- Semantic HTML first (`<button>`, `<nav>`, `<main>`, not `<div onclick>`).
- ARIA only when semantics can't do the job.
- Label every form field (`<label for>` or `aria-label`).
- Icon-only buttons need `aria-label`.
- Decorative images: `alt=""`. Meaningful: descriptive alt.
- Live regions (`aria-live`) for async updates the user should hear. Use `polite` for non-urgent updates (success messages, counts); `assertive` for critical errors only — it interrupts immediately.
- Prefer `aria-disabled="true"` over the `disabled` attribute for buttons that should stay in the tab order (e.g. a submit button that's temporarily blocked). `disabled` removes the element from keyboard navigation entirely.

## Motion

- Respect `prefers-reduced-motion` — but reduced motion ≠ no motion. Keep opacity and color transitions that aid comprehension. Remove movement, position changes, and large transforms.
- Vestibular disorders are real — parallax and big transforms can cause nausea.

## Touch

- Minimum 40×40px hit areas.
- Adequate spacing between interactive elements — 8px minimum between tap targets.

## Color

- Never rely on color alone to convey meaning. Pair with icon, text, or shape.
- Test with a color-blindness simulator.

## Language

- `<html lang="...">` always set.
- `dir="..."` for RTL languages.

## Attribution

Standard accessibility practice, synthesized against pbakaus/impeccable and WCAG 2.2.
