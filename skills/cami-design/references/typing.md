# Type Safety & Code Clarity

Deep reference for TypeScript discipline and codebase consistency. Loaded by `cami-design-engineer` when the diff touches type annotations, file naming, or comments.

## `as any`

Hides a type error rather than fixing it. Narrow with `unknown` + a type guard, or fix the source type.

## `interface` Where the Project Uses `type Props`

Stay with the project convention. Mixed styles look unintentional.

## Manual Annotations Where Inference Would Do

`const count: number = items.length` — the type is obvious. Drop the annotation.

## Barrel Files in a Project That Avoids Them

New `index.ts` re-export added where the convention is direct imports.

## Comments Explaining What the Code Does

Delete. Keep only comments that explain *why* a non-obvious choice was made (a workaround, a constraint, an invariant).

## Magic Numbers

A `7` or `0.85` in the middle of code with no name. Extract to a named constant.

## Files / Directories Not in kebab-case

If the project convention requires kebab-case, rename. Mixed casing causes import friction across OSes.

## `function foo()` Where the Convention Is Arrow Functions

Stay consistent with the project's existing style.

## Untested Business Logic

Hooks, utilities, or pure functions with branching logic (calculations, conditionals, state machines) and no test file. Don't write the tests yourself, but flag what the tech team should cover, e.g. `"calculateDiscount has 3 branches — needs tests for zero-quantity and expired-coupon cases"`.

## Attribution

Synthesized from common TS review practice; alignment with Vercel Labs `react-best-practices` and Anthropic Code Review guidelines.
