# State & Data Flow

Deep reference for state, effects, async, and data fetching. Loaded by `cami-design-engineer` when the diff touches `useState`, `useEffect`, async work, or shared data.

## Async in `useEffect` Without Cleanup

A fetch that fires, then the component unmounts before it resolves. Use `AbortController` for fetch, or an `ignore` flag for other async work, and return a cleanup function.

## API Call on Every Keystroke

Search inputs, filters, anything user-typed that triggers a request. Add a debounce (~300ms is the common default).

## State Only Read Inside Callbacks But Subscribed at Render

Causes re-renders the component doesn't need. Read the value via a ref or move the read inside the callback.

## Object or Array Dependencies in Effects

Triggers the effect on every render because the reference is new. Depend on primitive fields (`user.id`, not `user`), or memoize the object.

## Derived State Stored as State

A value that can be computed from existing state, kept in a separate `useState`. Compute it inline; don't double-track.

## Race Conditions on Rapid Input

Two requests fired in close succession, the slower one wins and overwrites the faster. Track the latest request id, or abort the previous one.

## Stale State in `setState`

`setCount(count + 1)` reads a stale `count` if multiple updates fire close together. Use the function form `setCount(prev => prev + 1)` whenever the new value depends on the previous.

## `.sort()` on React State

`.sort()` mutates the source array, so the state changes silently and React doesn't re-render. Use `[...arr].sort()` or `arr.toSorted()`. Same trap with `.reverse()` and `.splice()`.

## Independent Requests Fired Sequentially

Two `await`s in a row that don't depend on each other run one after the other. Wrap in `Promise.all([...])` so they run in parallel.

## Same Endpoint Fetched Independently in Multiple Components

Each component fires its own request for the same data. Use a request library that dedupes by key (React Query, SWR), or lift the fetch into a shared parent.

## Mutating Props Inside a Component

`user.lastViewed = new Date()` inside a component modifies data the parent owns — bugs propagate sideways and React doesn't see the change. Treat props as read-only. If something must change, notify the parent via a callback (`onView(user.id)`) and let it update its own state.

## Attribution

Synthesized from Vercel Labs `react-best-practices`, with stale-state and sort traps from Anthropic React docs.
