# pwlk-atelier-design

Camille Pawlak's personal Claude Code design skill. A curated collection of principles, references, and modes for building and reviewing interfaces with intent.

## What's inside

A parent skill (`atelier-design`) holds shared design principles, references, and the context-gathering protocol. Three sub-skills handle specific concerns:

- **`layout`** — alignment, sizing, spacing, visual hierarchy, rhythm
- **`interaction`** — animation, hover/press states, micro-interactions, delight
- **`copy`** — microcopy, labels, errors, tone

More modes may land over time (flow/experience, typography deep-dive, etc.).

## Structure

```
pwlk-atelier-design/
├── skills/
│   ├── atelier-design/        # parent skill: principles + references
│   │   ├── SKILL.md
│   │   ├── references/        # deep topical material, loaded on demand
│   │   └── libraries/         # structured data (palettes, easing, fonts)
│   ├── layout/SKILL.md
│   ├── interaction/SKILL.md
│   └── copy/SKILL.md
├── evals/                     # before/after test cases for iterative improvement
├── CHANGELOG.md               # what was absorbed from where, when
└── NOTICE.md                  # attribution to upstream skills
```

## Install

Clone into your Claude Code skills directory:

```bash
git clone https://github.com/pwlk/pwlk-atelier-design ~/.claude/skills/pwlk-atelier-design
```

Claude Code will pick up the skills under `skills/` automatically on the next session.

## Usage

Invoke the parent to orient, then a sub-skill for specific work:

```
/atelier-design              — load shared principles and pick a mode
/atelier-design layout       — review layout, alignment, spacing
/atelier-design interaction  — review motion, feedback, delight
/atelier-design copy         — review microcopy and tone
```

Or let the skill auto-trigger when you mention related work — the frontmatter descriptions are tuned for that.

## Design Context

Design work produces generic output without project context. Before the first run, create a `.atelier.md` at your project root with:

- **Target audience**: who uses the product
- **Use cases**: what they're trying to get done
- **Brand tone**: how the interface should feel

The skill will read it automatically on each invocation.

## Evolution

This skill is meant to grow by absorbing techniques from upstream skills (see `NOTICE.md` for current sources). The process:

1. Discover a new technique or upstream skill.
2. Run the eval corpus with current vs. candidate.
3. If the candidate wins, cherry-pick the specific material into the right reference file — never copy blindly.
4. Log the change in `CHANGELOG.md` with attribution.
5. Bump the `version` in the relevant `SKILL.md` frontmatter.

## Inspirations

- [anthropics/skills](https://github.com/anthropics/skills) — frontend-design, skill-creator
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — parent/child architecture, review format
- [emilkowalski/skill](https://github.com/emilkowalski/skill) — animation decision framework, philosophy
- [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) — micro-detail catalog

See `NOTICE.md` for full attribution.

## License

Apache 2.0. See `LICENSE`.
