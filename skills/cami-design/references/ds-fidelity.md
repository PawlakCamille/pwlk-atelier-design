# Design System Fidelity (Code)

Deep reference for code-level design-system adherence. Loaded by `cami-design-engineer` when the diff introduces or modifies styled components.

Pairs with the **Design System Protocol** in the parent SKILL.md (the principle "check for tokens before suggesting any value") — this file lists the concrete code-level violations to flag.

## Hardcoded Values Where a Token Exists

`bg-[#xxx]`, `text-[14px]`, `gap-[13px]`, inline `style={{ color: '...' }}`. Replace with the matching token (`bg-primary-100`, `text-body-13`, `gap-3`).

## DS Component Next to a Hand-Rolled Equivalent

A DS `Button` and a raw `<button>` in the same view. Pick the DS one.

## DS Primitives Imported From the Wrong Path

Import from the canonical entry (`@/components/ui/design-system`), not the legacy folder.

## New Token Introduced Inline

A one-off color or spacing value used in code that isn't in the DS. Flag as a gap to add to the DS file rather than hardcoding.

## `cn()` Overrides on a DS Variant

Conditional classes that fight the DS defaults. Use the variant prop the DS already exposes.

## Generic Tailwind Utilities Where the Project Has a Typed Scale

`font-bold`, `text-sm` on a project that defines `text-body-13`, `text-heading-24`. Use the typed scale.

## Attribution

Synthesized from common DS-fidelity review patterns. Pairs with the parent skill's **Design System Protocol**.
