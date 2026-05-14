# A11y Implementation

Code-level accessibility findings. Loaded by `cami-design-engineer` when reviewing interactive components.

Complements `accessibility.md` — that file holds the *principles* (contrast ratios, focus order, semantic HTML); this file lists *implementation-level* violations to flag in code.

## `<div onClick>` Instead of `<button>`

A `<div>` is not focusable, not keyboard-operable, not announced as interactive. Use `<button>` (or add `role="button"` + `tabindex="0"` + Enter/Space handlers if the element must stay a `<div>`).

## Icon-Only Button Without an Accessible Name

Screen readers say "button" with no context. Add `aria-label` or a visually-hidden text label.

## Form Input Not Linked to a Label

No `<label htmlFor>`, no `aria-labelledby`, no `aria-label`. Wire one of the three. (Pairs with `forms.md` → Labels.)

## Decorative Icon Read Aloud, or Content Image With No Alt

`<img>` without `alt`, or a decorative icon without `aria-hidden="true"`. Add the right attribute.

## Modal Missing Focus Management

No focus trap, no initial focus, no `aria-modal`. Use a tested dialog primitive (Radix, Headless UI, the project's DS) rather than rolling your own.

## Color-Only Signal

Red text to mean "error", green dot to mean "online". Add a text label, an icon, or `role="alert"` so the meaning isn't lost without color. (Pairs with `accessibility.md` → Color.)

## Custom Interactive Element Missing Keyboard Handlers

A clickable div, a custom select, a draggable item. Wire Enter/Space for actions, arrow keys for menus and lists.

## Attribution

Synthesized from WCAG 2.2 and Anthropic accessibility review practice.
