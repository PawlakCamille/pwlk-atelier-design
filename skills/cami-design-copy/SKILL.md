---
name: cami-design-copy
description: Labels, errors, empty states, tone. Use when text reads awkwardly or leaves users guessing what to do.
user-invocable: true
argument-hint: "[target]"
---

# Cami — Copy

## Required reading

Before proceeding, load `../cami-design/SKILL.md` and apply its **Context Gathering Protocol**, **Design System Protocol**, **Severity scale**, and **Review Output Format**. For copy work you also need:

- **Voice / tone**: how does the product speak? (formal, friendly, sharp, playful, neutral)
- **Audience literacy**: technical users? consumers? mixed?
- **User's mental state in context**: stressed during errors? confident during success? anxious during payment? Copy should match the emotional register of the moment.

If the audited surface includes form controls, also load `../cami-design/references/forms.md` — labels, placeholders, error placement, confirmations, and unsaved-changes warnings are all canonicalised there.

---

Improve the words users read. Clearer labels, kinder errors, useful empty states, a tone that matches the brand.

## When to Use This Mode

- Labels are ambiguous or jargon-heavy
- Error messages blame the user or say nothing actionable
- Empty states are blank or unhelpful
- CTAs don't tell the user what happens next
- Tone drifts across the product
- User says "this text is confusing"

## Review Dimensions

### Clarity
- Every label tells the user what will happen, in their words
- No jargon unless the audience uses it naturally
- One idea per sentence
- Prefer active voice: "We uploaded your file" not "Your file has been uploaded"

### Actionability (especially errors)
- Error messages say: what happened, why, what to do next
- Avoid blame ("you entered an invalid...") — state the fact ("email format not recognized")
- Offer a next step when one exists

### Empty States
- Explain what this space is for
- Show a primary action to fill it
- Never leave a blank region

### CTAs
- Verb-first, concrete ("Save changes", not "OK")
- Match the outcome ("Delete permanently" not "Delete" for irreversible actions)
- Primary action is distinct from secondary in weight and wording

### Tone Consistency
- The product speaks with one voice across surfaces
- Adjust intensity by context: transactional moments stay neutral, celebratory moments can be warmer

### Forms & Confirmations

Form-related copy patterns — instructions before the field, placeholders as examples not labels, confirmation dialog wording, destructive button labels, unsaved-changes warnings — live in `../cami-design/references/forms.md` (Labels, Placeholders, Unsaved Changes sections). Load that reference when reviewing form copy. The patterns there are the canonical source; this sub-skill applies them.

### Loading & Success States
- Loading copy should set expectations: what's happening + how long ("Analyzing your data… usually 30–60 seconds")
- Never leave "Loading..." for long operations — give context
- Success messages confirm what happened + what comes next ("Settings saved. Changes take effect immediately.")
- Match emotional register: celebrate big wins, stay neutral for routine saves
- **Strip "successfully"** — it adds nothing. "Saved." not "Saved successfully." "Voice updated." not "Voice updated successfully."

### ⚠️ AI Slop in Copy

The copy-side "AI tells" sweep — generic loading messages ("Herding pixels…", "Teaching robots to dance…"), trailing "successfully", sparkle emoji on every CTA, sycophantic confirmations ("Great choice!") — is canonicalised in `../cami-design/references/anti-patterns.md` → *Copy AI tells*. Run it last, same as the visual anti-pattern sweep.

### Microcopy Hygiene
- Sentence case in UI (not Title Case) unless the brand specifies otherwise
- Oxford comma: follow house style; be consistent
- No trailing punctuation on buttons or labels
- No exclamation marks in success or status messages — "Saved." not "Saved!" Reserve `!` for genuine milestones
- Numerals for UI (use `1, 2, 3` not `one, two, three` for quantities)

## Patterns

### Error messages
| Avoid | Prefer |
| --- | --- |
| "Something went wrong." | "We couldn't save your changes. Try again, or refresh the page." |
| "Invalid input." | "Email needs an `@` and a domain." |
| "Error 500." | "Our server had a hiccup. We've been notified — try again in a moment." |
| "Failed to save." | "Couldn't save — try again in a moment." |
| "Failed to remove user." | "Couldn't remove this member — try again in a moment." |

**Pattern:** "Failed to…" → "Couldn't…" + next step. Shorter, warmer, always followed by what to do.

### Empty states
| Avoid | Prefer |
| --- | --- |
| "No results." | "Nothing matches *"[query]"*. Try broader terms or clear filters." |
| "No items yet." | "Start by adding your first [item]. [+ button]" |

### CTAs
| Avoid | Prefer |
| --- | --- |
| "Submit" | "Send message" / "Create account" / "Pay $49" |
| "Cancel" + "OK" on destructive modal | "Keep [item]" + "Delete permanently" |

## The 6 Principles

Every piece of copy should pass this checklist:

1. **Specific** — "Enter email" not "Enter value"
2. **Concise** — cut every word that doesn't add meaning (but never sacrifice clarity for brevity)
3. **Active** — "Save changes" not "Changes will be saved"
4. **Human** — "Oops, something went wrong" not "System error encountered"
5. **Helpful** — tell users what to do, not just what happened
6. **Consistent** — pick one term per concept and never vary it (don't alternate between "workspace" and "project" for variety)

## NEVER
- Use jargon without explanation
- Blame the user ("You made an error" → "This field is required")
- Be vague ("Something went wrong" without explanation or next step)
- Use passive voice when active is possible
- Use placeholder text as the only label — it disappears when the user types
- Vary terminology across the product for stylistic variety — consistency beats cleverness
- Write AI-slop loading messages (see ⚠️ section above)
- Use humor during errors — be empathetic instead
- Assume technical knowledge

## Output

Findings as tables with columns `# | Severity | Before | After | Why`, grouped by dimension. Severity is 🔴 (Important) or 🟡 (Nit) — see the parent skill's `Review Output Format → Severity scale` for calibration. Cite the specific file and component when possible.

Close with the walkthrough offer and (after fixes) the Verify pass — see parent skill `Review Output Format → Closing / Walkthrough mode / Verify pass`.

## References

- `../cami-design/references/craft.md` — tone, intent, perceived performance
- `../cami-design/references/forms.md` — form labels, placeholders, errors, confirmations, unsaved-changes (canonical for form copy)
- `../cami-design/references/typography.md` — typographic characters: ellipsis, curly quotes, non-breaking spaces
- `../cami-design/references/anti-patterns.md` — sweep last for AI tells in copy

## Human-facing writing note

When producing copy meant for users, run the output through the `humanizer` skill if available — it strips AI-tell patterns that read as synthetic. `humanizer` is an external skill (not bundled with `cami-design`); see `NOTICE.md` for sourcing. Skip silently if it's not installed.
