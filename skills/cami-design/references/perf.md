# Performance & Rendering

Deep reference for React rendering performance. Loaded by `cami-design-engineer` when the diff touches lists, memoization, animation, or heavy state.

## Array Index Used as React `key`

Causes wrong items to update when the list reorders, filters, or has insertions. Use a stable id from the data.

## Static JSX or Constants Created Inside the Component Body

A constant array, an inline `<svg>` recreated on every render. Hoist outside the component.

## Heavy Component Loaded Eagerly

A chart library, a rich-text editor, a markdown renderer always in the bundle even when the feature isn't used. Lazy-load with `lazy()` / `dynamic()`.

## Barrel Imports Pulling in More Than Needed

`import { Button } from '@/components/ui'` where the barrel re-exports 30 components. Import directly when bundle size matters.

## Missing `memo` on a Component Inside a Hot List

Only flag if the list is large *and* the component receives stable props. Don't memoize speculatively — premature `memo` adds noise.

## Inline Function or Object Passed to a Memoized Component

`<MemoCard onClick={() => handle(id)} style={{ padding: 16 }} />` — the inline value is a new reference on every render, silently defeating `memo`. Extract stable callbacks with `useCallback` and objects with `useMemo` at the call site.

## Default Prop Value `{}` or `[]` on a Memoized Component

`function Card({ items = [] })` creates a new array reference on every render. Pull the default outside the component: `const EMPTY: Item[] = []` and use that.

## `useMemo` Wrapping a Trivially Cheap Expression

`useMemo(() => items.length, [items])` — the overhead of `useMemo` itself is higher than the computation. Only memoize when the expression is measurably expensive or produces a referentially stable object that feeds another hook.

## `{value && <Component />}` Where `value` Can Be `0` or `''`

React renders the falsy value instead of skipping. Use a ternary: `{value ? <Component /> : null}`.

## Animation Applied to the `<svg>` Element

Animating the SVG itself is expensive; animate a wrapper `<div>` or use CSS `transform` on the wrapper.

## Animation on Layout Properties in Framer Motion

`animate={{ width, height, padding, margin }}` forces layout recalculation every frame. Use `animate={{ scaleX, scaleY }}` with `transformOrigin` instead, or restructure so only `transform` and `opacity` animate.

## Nondeterministic Value in Render Body Causing Hydration Mismatch

`new Date()`, `Math.random()`, `crypto.randomUUID()`, `performance.now()` in the component body produce different values on server and client. Move them into `useEffect`, `useState` initializer, or a server-only context.

## Expensive Computation in `useState` Initial Value

`useState(buildBigList())` runs `buildBigList()` on every render even though only the first call matters. Pass a function: `useState(() => buildBigList())`.

## Heavy State Update Blocking the Input

Filtering a 10k-row list on every keystroke freezes the field. Wrap the heavy update in `startTransition(() => setFiltered(...))` so React keeps typing responsive and updates the list when it can.

## `setState` Inside a High-Frequency Handler

`setState` called directly in `scroll`, `mousemove`, or `wheel` handlers queues a synchronous re-render on every event tick — typically 60–120 times per second. Wrap in `startTransition` for non-urgent updates, or use `useDeferredValue` when the derived value drives a heavy subtree.

## Same Global Listener Attached in Many Components

Multiple components each call `window.addEventListener('scroll' / 'resize' / 'keydown')`. Memory leak risk and duplicated work. Centralize in one custom hook with subscriber callbacks, or attach once at the app root.

## `.includes()` or `.find()` on a Large Array in a Hot Loop

O(n) lookup repeated for every item is O(n²). Build a `Set` (membership) or `Map` (key→value) once, then look up in O(1).

## Attribution

Synthesized from Vercel Labs `react-best-practices`, MDN, and Anthropic React docs.
