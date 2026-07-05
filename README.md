# OCP-CERTIF-EXAM

A static web app to train for the **Java OCP certification** exam. Built with Astro, React, and Tailwind CSS. Deployed on GitHub Pages.

**Live site:** https://feuscel.github.io/OCP-CERTIF-EXAM/

## Features

- Interactive exam engine with global countdown timer, free navigation (Previous/Next), and shuffle for both questions and options.
- Single-choice and multiple-choice questions with **partial-credit scoring** (precision/recall blend, clamped to [0, 1]).
- Pass threshold: **60%**.
- Detailed per-question correction: selected answers, correct answers, per-question score, and bilingual explanations (FR/EN).
- Bilingual UI (French default, English fallback).
- Dark mode toggle (persisted).
- Attempt history and progression view persisted in browser LocalStorage.
- Content authored in Markdown/MDX with a strict frontmatter schema; invalid content fails the build with a clear error.

## Tech Stack

- **Astro 5** — static output, base path `/OCP-CERTIF-EXAM/`
- **React 19** — interactive quiz engine (via `@astrojs/react`)
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **MDX** (via `@astrojs/mdx`)
- **Persistence:** browser LocalStorage (keys versioned `ocp.exam.*.v1`)
- **Package manager:** [pnpm](https://pnpm.io) (do not use npm/yarn)
- **Deployment:** GitHub Actions -> GitHub Pages

## Prerequisites

- Node.js (use the LTS version recommended by Astro 5)
- pnpm — install via `corepack enable && corepack prepare pnpm@latest --activate` if needed

## Getting Started

```sh
pnpm install   # install dependencies
pnpm dev       # start the dev server (http://localhost:4321/OCP-CERTIF-EXAM/)
```

## Scripts

| Command             | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`          | Start the dev server                                                        |
| `pnpm build`        | Production build to `dist/` (validates content schema + emits static pages) |
| `pnpm preview`      | Preview the built site                                                      |
| `pnpm astro check`  | TypeScript / `.astro` diagnostics                                          |

There is no separate `lint` / `typecheck` script. **`pnpm build` is the end-to-end verification command** — run it before committing.

## Project Structure

```
.
├── .github/workflows/deploy.yml   # GitHub Pages deploy workflow
├── AGENTS.md                       # Agent-facing ruleset (stack, commands, conventions)
├── CONTRIBUTING.md                 # Commit conventions and PR workflow
├── PROJECT_REFERENCE_OCP.md        # Locked spec — source of truth for implementation choices
├── astro.config.mjs                # Astro config (base path, integrations)
├── src/
│   ├── components/
│   │   ├── Progression.tsx         # Attempt history / progression view
│   │   ├── ThemeToggle.tsx         # Dark mode toggle
│   │   └── quiz/                   # Quiz engine + report components
│   ├── content/
│   │   └── exams/                  # Exam batches (1 .md/.mdx file = 1 batch)
│   ├── content.config.ts           # Strict zod schema (with superRefine)
│   ├── layouts/
│   ├── pages/
│   │   ├── exam/[id].astro         # Exam route (clean slug)
│   │   └── index.astro             # Home — lists available exams
│   └── styles/
└── package.json
```

## Content Authoring

Exam files live in `src/content/exams/` and may be `.md` or `.mdx`. **One file = one exam batch.** Each file's frontmatter defines exam-level metadata and a `questions` array.

### Frontmatter Example

```yaml
id: "exam-ocp-01"
title: "Java OCP Exam 01"
lang: "fr" # fr | en
duration_minutes: 90
shuffle_questions: true
shuffle_options: true
difficulty: "mixed" # easy | medium | hard | mixed
tags: ["inheritance", "polymorphism"]
questions:
  - id: "ocp-01-001"
    title: "Heritage et Polymorphisme"
    type: "multiple-choice" # single-choice | multiple-choice
    options:
      - A: "L'interface compile sans erreur."
      - B: "Une exception est levee a l'execution."
      - C: "Erreur de compilation a la ligne 4."
      - D: "Erreur de compilation a la ligne 5."
    correct_answers: ["C", "D"]
    explanation_fr: "..."
    explanation_en: "..."
```

### Validation Rules

- Every exam has a unique `id`.
- Every question has a unique `id` within its exam.
- `single-choice` => exactly 1 correct answer.
- `multiple-choice` => 1..N correct answers.
- Option keys must be unique labels (A, B, C, ...).
- `correct_answers` values must exist in option labels.

`title` and `options` text support a tiny markdown subset: inline `code` (backticks) and fenced ``` code blocks (triple backticks, multiline). No other markdown features.

The schema is enforced in `src/content.config.ts` with `superRefine`; invalid frontmatter fails `pnpm build` with a clear error.

## Scoring

### Multiple-choice partial credit (locked formula)

For a question, let **C** = correct options and **U** = user-selected options:

- precision-like = |U ∩ C| / |U|  (if |U| > 0, else 0)
- recall-like    = |U ∩ C| / |C|
- question score = (precision-like + recall-like) / 2, clamped to [0, 1]

Selecting extra wrong options lowers the score; selecting only part of the correct set gives partial credit; an empty answer gives 0.

### Pass threshold

60% of the total score.

## Persistence

Attempt history is saved to LocalStorage (unlimited retention):

- `ocp.exam.attempts.v1` — timestamp, exam id, duration used, score percent, pass/fail
- `ocp.exam.settings.v1` — user settings
- `ocp.theme.v1` — dark mode preference

Keys are versioned (`v1`) for backward compatibility. The app tolerates empty or corrupted LocalStorage without crashing.

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the static site and deploys it to GitHub Pages on pushes to `main`. The Astro base path is set to `/OCP-CERTIF-EXAM/`.

## Documentation

- [`PROJECT_REFERENCE_OCP.md`](./PROJECT_REFERENCE_OCP.md) — locked spec, the source of truth for implementation choices.
- [`AGENTS.md`](./AGENTS.md) — agent-facing ruleset (stack, commands, conventions, phase progress).
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — commit conventions, branch naming, and PR workflow.

## Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) first. In short:

- Use **pnpm**, not npm/yarn.
- Follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <description>`.
- Run `pnpm build` before committing.
- Keep PRs focused; one logical change per commit.

## License

This project is licensed under the [MIT License](./LICENSE).