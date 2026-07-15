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
- `pnpm test` — run unit tests (Vitest)
- `pnpm test:watch` — run tests in watch mode

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
- Source: `src/content/exams/*.md` and `*.mdx` (1 file = 1 exam batch).
- Schema: `src/content.config.ts` — strict zod schema with `superRefine` validating:
  - unique question `id` per exam
  - `single-choice` => exactly 1 correct answer
  - `multiple-choice` => at least 1 correct answer
  - option `label`s are unique within a question
  - `correct_answers` values must exist in option `label`s
- Exam-level fields: `id`, `title`, `lang` (fr|en, default/primary), `duration_minutes`, `shuffle_questions`, `shuffle_options`, `difficulty` (easy|medium|hard|mixed), `tags`, `questions`.
- Question fields are fully bilingual: `title_fr`/`title_en`, `explanation_fr`/`explanation_en`. Each option is an object `{ label, text_fr, text_en }`.
- `title_fr`/`title_en` and option text support a tiny markdown subset rendered by `src/components/quiz/RichText.tsx`: inline `code` (backticks) and fenced ``` code blocks (Java syntax-highlighted via `highlightJava.tsx`). No other markdown features.
- Route: `src/pages/exam/[id].astro` (clean slug via `.replace(/\.(md|mdx)$/, '')`). Frontmatter is mapped to `ExamView`/`QuestionView` (`src/components/quiz/types.ts`) before hydration.

## Key Source Locations
- `src/components/quiz/Quiz.tsx` — quiz engine (timer, navigation, shuffle, answer state, submit)
- `src/components/quiz/Report.tsx` — evaluation report + per-question correction
- `src/components/quiz/scoring.ts` — partial-credit formula + `PASS_THRESHOLD = 0.6`
- `src/components/quiz/shuffle.ts` — question/option shuffle with stable original-label mapping
- `src/components/quiz/storage.ts` — LocalStorage attempts + settings (safe-guarded against quota/corruption)
- `src/components/quiz/LanguageToggle.tsx` — FR/EN switch used in Quiz header and Report
- `src/components/quiz/RichText.tsx` + `highlightJava.tsx` — markdown-subset rendering for question/option text
- `src/components/ThemeToggle.tsx` — dark mode toggle (`ocp.theme.v1`)
- `src/components/Progression.tsx` — attempt history / progression view on home
- `src/layouts/Layout.astro` — applies theme pre-paint from `ocp.theme.v1` to avoid flash

## Conventions
- Bilingual content (FR/EN): questions (`title_fr`/`title_en`), options (`text_fr`/`text_en`), and `explanation_*`. `exam.lang` is the default; the in-exam `LanguageToggle` switches title/option/explanation live and persists the choice.
- UI chrome strings remain French in V1 (full UI-chrome i18n is out of scope).
- Question statements live in frontmatter (`title_fr`/`title_en`), not the markdown body. The markdown body is not parsed for statements.
- Dark mode is user-toggleable and persisted (`ocp.theme.v1`), applied pre-paint in `Layout.astro`.
- Keep LocalStorage keys backward-compatible and versioned: `ocp.exam.attempts.v1`, `ocp.exam.settings.v1`, `ocp.theme.v1`. The app tolerates empty or corrupted LocalStorage without crashing.
- No comments in source files unless explicitly requested.

## Phase Progress
- [x] Phase 1 — Setup, content collection, base path, home listing
- [x] Phase 2 — React quiz engine (timer, navigation, shuffle, answer state)
- [x] Phase 3 — Evaluation and report (partial-credit formula, pass threshold 60%)
- [x] Phase 4 — LocalStorage persistence + progression view

All 4 phases shipped. See `PROJECT_REFERENCE_OCP.md` §10 for the phase-by-phase done criteria.

## Next Steps
See [`ROADMAP.md`](./ROADMAP.md) for the agreed plan covering tests, script fixes, batch extraction pipeline, and progressive chapter coverage (2→5→10→21).