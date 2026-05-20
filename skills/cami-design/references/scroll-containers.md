# Scroll Containers

Deep reference for inset scrollable regions — sidebars, modal bodies, command menus, dropdowns, code blocks, table wrappers, chat transcripts, carousels. Loaded on demand.

A scroll container is a unit of craft on its own. Three rules turn the default browser behavior into something that feels intentional: reserve the gutter so layout doesn't jump, tame the scrollbar so it stops shouting, and fade the edges so the affordance is visible without copy.

## Contents

- [Scrollbar Gutter](#scrollbar-gutter)
- [Tame Native Scrollbars](#tame-native-scrollbars)
- [Scroll Edge Mask](#scroll-edge-mask)

## Scrollbar Gutter

Reserve space for the scrollbar on scrollable containers so content doesn't shift horizontally when the scrollbar appears.

- Apply to modal bodies, side panels, dialogs with dynamic content — any scrollable container where expand/collapse could trigger overflow
- Safe no-op on platforms with overlay scrollbars (most macOS, iOS default), so the cost is zero
- Baseline since 2023

```css
.modal-body {
  overflow-y: auto;
  scrollbar-gutter: stable;
}
```

## Tame Native Scrollbars

Default scrollbars (especially Windows/Chrome) are visually loud and break the integrity of a tuned UI. The standards two-liner fixes it:

```css
.scrollable-region {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
```

Always tie the thumb color to a design token (`--border`, `--muted`, whatever your system calls the subtle stroke color). Hardcoding `gray` means the scrollbar drifts from the rest of the UI when the palette shifts (dark mode, brand re-tint).

**Apply to inset scroll containers**, not the document. A blanket `*` rule flattens the page's main scrollbar too, which is the one place a normal-width control still helps usability — thin scrollbars are harder to grab and the position indicator becomes less legible. Scope to sidebars, modal bodies, command menus, dropdowns, code blocks, table wrappers.

**Browser support.** Both properties are baseline since Chrome 121 (Jan 2024) and Safari 18.2 (Dec 2024). For most product codebases in 2026, no fallback needed. If your support contract reaches pre-2024 Safari, add the prefixed version:

```css
.scrollable-region::-webkit-scrollbar { width: 5px; }
.scrollable-region::-webkit-scrollbar-track { background: transparent; }
.scrollable-region::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 5px;
}
```

**Pair with `scrollbar-gutter: stable`** on containers where the scrollbar appears and disappears (modal bodies, dynamic lists), to prevent horizontal content shift.

## Scroll Edge Mask

A scrollable region with hard edges hides its own affordance — users can't tell at a glance that more content lives above or below the fold. Fading the edges as the user scrolls solves it without a JS scroll listener, using `mask-image` driven by `animation-timeline: scroll()`.

```css
@property --scroll-mask-t { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
@property --scroll-mask-b { syntax: "<percentage>"; inherits: false; initial-value: 100%; }

.scroll-mask-y {
  overflow-y: auto;
  mask-image:
    linear-gradient(to bottom, transparent 0%, black var(--scroll-mask-t)),
    linear-gradient(to top,    transparent 0%, black calc(100% - var(--scroll-mask-b)));
  mask-composite: intersect;
  animation: scroll-mask-y linear both;
  animation-timeline: scroll(self block);
}

@keyframes scroll-mask-y {
  0%        { --scroll-mask-t: 0%;  --scroll-mask-b: 90%; }
  10%, 90%  { --scroll-mask-t: 10%; --scroll-mask-b: 90%; }
  100%      { --scroll-mask-t: 10%; --scroll-mask-b: 100%; }
}
```

The fade only appears on the side that has more content: the top edge stays sharp at scroll-top, the bottom edge stays sharp at scroll-end. No JS, no scroll listeners, no layout thrash.

**Where it earns its keep.** Lists, carousels, dropdown bodies, chat transcripts, sidebars — any inset scroll container flush against a surface. Skip it when the container already has a visible border or shadow, since the mask reads as a second, weaker boundary signal.

**Watch out for sticky children.** A sticky header inside a masked container gets faded along with the rest. If you need both, mask only the inner scroll wrapper and keep the sticky element in a sibling above it. The same applies to focus rings on items near the edge — verify keyboard traversal once the mask is in place.

**Pair with** [Tame Native Scrollbars](#tame-native-scrollbars) and [Scrollbar Gutter](#scrollbar-gutter) for a complete scroll-container recipe: visible-but-quiet scrollbar, stable gutter, soft edges.

**Browser support.** `animation-timeline: scroll()` ships in Chromium 115+ (Jul 2023). Safari and Firefox don't support it as of May 2026 — the `mask-image` declarations still parse, so non-supporting browsers render the static initial fade, which is a sensible no-op. Wrap in `@supports (animation-timeline: scroll())` if you want the dynamic effect strictly gated.

## Attribution

Synthesized from: MDN web docs (`scrollbar-gutter`), rauno freiberg + chánh đại on scrollbar styling (tame native scrollbars), twilson.net/scroll-mask (scroll edge mask).
