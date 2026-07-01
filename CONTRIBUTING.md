# Contributing to OCP-CERTIF-EXAM

Thank you for contributing! This document describes the workflow and commit conventions for the OCP-CERTIF-EXAM project.

## Development Setup

```sh
pnpm install      # install dependencies (do NOT use npm/yarn)
pnpm dev          # start dev server
pnpm build        # production build (validates content schema + emits static pages)
pnpm astro check  # TypeScript / astro diagnostics
```

There is no separate `lint` / `typecheck` script. **`pnpm build` is the end-to-end verification command** — run it before committing.

## Source of Truth

- `PROJECT_REFERENCE_OCP.md` is the locked spec. If a change conflicts with it, update the spec first (see §13 Working Rules).
- `AGENTS.md` is the agent-facing ruleset (stack, commands, conventions, phase progress).

## Commit Convention — Conventional Commits

This project follows [Conventional Commits 1.0.0](https://www.conventionalcommits.org/). Every commit message MUST use this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed types

| Type       | Use for                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| `feat`     | A new feature (user-facing).                                                     |
| `fix`      | A bug fix (user-facing).                                                         |
| `docs`     | Documentation only (README, AGENTS.md, CONTRIBUTING.md, spec markdown).          |
| `style`    | Formatting, whitespace, class tweaks with no code logic change.                  |
| `refactor`| Code restructuring without behavior change.                                     |
| `perf`     | Performance improvement.                                                         |
| `test`     | Adding or correcting tests.                                                      |
| `build`    | Build system, dependencies, config files (astro.config, tsconfig, package.json).|
| `ci`       | CI / GitHub Actions workflow changes.                                            |
| `chore`    | Misc repo tasks that don't fall in the other types.                              |
| `revert`   | Reverting a previous commit.                                                     |

### Scopes (optional but recommended)

Use a lowercase scope to indicate the affected area:

- `quiz` — React quiz engine (`src/components/quiz/`)
- `report` — evaluation & report (`src/components/quiz/Report.tsx`, `scoring.ts`)
- `content` — content collection schema or exam files (`src/content.config.ts`, `src/content/exams/`)
- `ui` — layout, theme, home page, visual styling
- `persistence` — LocalStorage / progression (`storage.ts`, `Progression.tsx`)
- `dx` — developer experience (tooling, hooks)
- `deps` — dependency bumps
- omit the scope for cross-cutting changes

### Rules

1. **Subject line**:
   - Use the imperative mood: `add`, `fix`, `update`, `remove` — not `added`, `fixes`, `adding`.
   - Lowercase first letter, no trailing period.
   - Max 72 characters.
2. **Scope** is optional; use it whenever the change is contained to one area.
3. **Breaking change**: append `!` after the type/scope, e.g. `feat(quiz)!: drop v0 answer format`. Explain in the body or footer with `BREAKING CHANGE: <desc>`.
4. **Body** (optional): wrap at 100 chars, explain the *why* not the *what*. Use bullet points with `-`.
5. **Footer** (optional): reference issues `Closes #12`, `Refs #34`, or note breaking changes.
6. One logical change per commit — don't mix a feature and unrelated refactors.
7. Don't commit secrets, `.env` files, or `dist/` (already in `.gitignore`).

### Examples

```
feat(quiz): add global countdown timer

Implements a per-exam global countdown that auto-submits at 0.
Turns the timer badge red when ≤ 60 s remain.

Closes #3
```

```
fix(report): correct partial-credit clamp on negative precision

The formula could yield a tiny negative value due to float error
when intersection was empty; clamp now guarantees [0, 1].
```

```
docs: amend spec for code rendering in titles/options

Backticks and fenced blocks now render in question statements.
```

```
build(deps): bump astro to 5.4.0
```

## Pull Requests

1. Branch from `main`: `feat/short-description`, `fix/short-description`, or `docs/...`.
2. Open a PR titled with the same Conventional Commit prefix as the squashed commit you want.
3. Ensure `pnpm build` passes before requesting review.
4. Keep PRs focused; split unrelated changes into separate PRs.

## Content Changes

- Exam files live in `src/content/exams/` (`.md` or `.mdx`).
- The schema (`src/content.config.ts`) is strict and uses `superRefine`. Invalid frontmatter fails the build with a clear error.
- One file = one exam batch.

## Branch Naming

- `feat/<scope>-<short-desc>` e.g. `feat/quiz-timer`
- `fix/<scope>-<short-desc>` e.g. `fix/report-clamp`
- `docs/<short-desc>`
- `chore/<short-desc>`

## Pointers

- Do not parse the markdown body for question statements in V1 (statement lives in frontmatter `title`).
- Keep LocalStorage keys backward-compatible (`ocp.exam.*.v1`).
- No comments in source files unless explicitly requested.
- Re-read `PROJECT_REFERENCE_OCP.md` §10 done criteria before starting a new phase.