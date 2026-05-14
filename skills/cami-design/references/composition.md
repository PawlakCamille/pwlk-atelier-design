# Composition Patterns

Deep reference for component composition. Loaded by `cami-design-engineer` when the diff touches component shape, prop surface, or state location.

## Boolean Prop Sprawl

Three or more on/off flags on a single component (`isLarge`, `isOutlined`, `hasIcon`, `isLoading`). Replace with an explicit `variant` prop, or split into composable sub-parts using the compound pattern: `<Tabs><Tabs.List><Tabs.Trigger /></Tabs.List></Tabs>`.

The fix scales — variants and sub-parts encode orthogonal concerns separately; booleans collapse them and force every new state into a flag.

## Render Props Where `children` Would Do

A function-as-prop that returns JSX (`renderItem`, `renderHeader`). Pass children directly unless the parent must control the loop (virtualization, recursion, slot ordering).

## `forwardRef` in React 19+ Code

React 19 makes `ref` a normal prop, so the wrapper is no longer needed. Drop the `forwardRef(...)` call. Check `package.json` to confirm React version before flagging.

## Fetch and Render in the Same File

Data-loading and presentation tangled together: hard to test, hard to reuse. Split into a container that fetches and a pure component that displays.

## Same JSX Shape in 3+ Files

Extract to a shared component. Two occurrences? Leave it — premature abstraction is worse than duplication.

## State Scattered Across Siblings

Two sibling components both manage a piece of the same UI state via prop drilling or duplicated `useState`. Lift the state into a parent provider; children read it via context.

## Children Know How State Is Stored

A compound component where `<Tabs.Trigger>` imports a Zustand store directly or references `useReducer`. The provider should expose a stable interface (`{ state, actions }`); children only consume it.

## Context Exposes Raw Setters Instead of Intent

Context value with `setActiveTab`, `setOpen`, `setValue` instead of `select`, `toggle`, `change`. Refactor to a `{ state, actions, meta }` shape so the provider can be swapped for testing or a different state lib without rewriting consumers.

## Attribution

Synthesized from Vercel Labs `composition-patterns` skill, with React 19 specifics from Anthropic React docs.
