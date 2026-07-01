# AGENTS.md

## Project
OCP-CERTIF-EXAM — static Astro + React + Tailwind app for Java OCP certification exam training. Deployed on GitHub Pages.

See `PROJECT_REFERENCE_OCP.md` for the full locked spec (source of truth).

## Stack
- Astro 5 (static output, base path `/OCP-CERTIF-EXAM/`)
- React 19 (interactive UI) via `@astrojs/react`
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- MDX via `@astrojs/mdx`
- Persistence: browser LocalStorage
- Package manager: **pnpm** (not npm/yarn)

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — production build to `dist/` (validate content collection schema + typecheck + emit static pages)
- `pnpm preview` — preview the built site
- `pnpm astro check` — TypeScript/astro diagnostics for `.astro` files

Note: there is no separate `lint`/`typecheck` script. The strict content schema + astro check are the validators; `pnpm build` is the end-to-end verification command.

## Commits
Follow **Conventional Commits** strictly. See `CONTRIBUTING.md` for the full rules, allowed types, scopes, and examples.

Quick reference:
- Format: `<type>(<scope>): <description>`
- Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`
- Scopes: `quiz` `report` `content` `ui` `persistence` `dx` `deps` (omit for cross-cutting)
- Imperative subject, lowercase, ≤ 72 chars, no trailing period
- `build` MUST pass before committing
- One logical change per commit; never stage secrets

## Content Collection
- Source: `src/content/exams/*.md` and `*.mdx` (1 file = 1 exam batch)
- Schema: `src/content.config.ts` — strict zod schema with `superRefine` validating:
  - unique exam `id`
  - unique question `id` per exam
  - `single-choice` => exactly 1 correct answer
  - `multiple-choice` => >= 1 correct answer
  - option keys are unique labels
  - `correct_answers` values must exist in option labels
- Content pair: `lang` (fr|en) on exam, with bilingual `*_fr`/`*_en` explanations per question.
- Route: `src/pages/exam/[id].astro` (gets clean slug via `.replace(/\.(md|mdx)$/, '')`).

## Conventions
- Bilingual UI (FR/EN) — French is default with EN fallback fields.
- Do not parse markdown body for statements in V1 (question statement lives in frontmatter `title`).
- Keep schema versioning backward-compatible in LocalStorage keys (`ocp.exam.*.v1`).
- No comments in source files unless explicitly requested.

## Phase Progress
- [x] Phase 1 — Setup, content collection, base path, home listing
- [x] Phase 2 — React quiz engine (timer, navigation, shuffle, answer state)
- [x] Phase 3 — Evaluation and report (partial-credit formula, pass threshold 60%)
- [x] Phase 4 — LocalStorage persistence + progression view

Before starting each phase, re-read `PROJECT_REFERENCE_OCP.md` section 10 done criteria.