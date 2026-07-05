# PROJECT REFERENCE - OCP CERTIF EXAM

Status: V1 complete (phases 1-4 shipped)
Date: 2026-07-01 (initial) / 2026-07-02 (V1 completion)
Deployed: https://feuscel.github.io/OCP-CERTIF-EXAM/

## 1) Product Goal
Build a static web app (GitHub Pages) to train for Java OCP certification.
The app parses Markdown/MDX content, builds interactive exams, and shows detailed reports.

## 2) Tech Stack (locked)
- Framework: Astro
- Interactive UI/state: React
- Styling: Tailwind CSS
- Persistence: browser LocalStorage
- Deployment: GitHub Actions -> GitHub Pages

## 3) Repository and Hosting
- Repository name: OCP-CERTIF-EXAM
- Astro base path: /OCP-CERTIF-EXAM/
- Deployment branch: main

## 4) Content Model Decisions
- UI language: bilingual FR/EN
- Content granularity: 1 Markdown/MDX file = a batch of questions
- Question statement location (V1): frontmatter only (no markdown body parsing for statements)
- Code rendering (V1 amendment 2026-07-02): `title_fr`/`title_en` and option `text_fr`/`text_en` support a tiny markdown subset — inline `code` (backticks) and fenced ``` code blocks (triple backticks, multiline). Rendered as styled `<code>` / `<pre><code>` by `src/components/quiz/RichText.tsx`. No other markdown features.
- MDX support required in V1: yes

## 5) Source Content Location
- Folder: src/content/exams/
- Allowed extensions: .md and .mdx

## 6) Frontmatter Contract (strict)
V1 exam file frontmatter must define exam-level metadata and questions array.

Proposed strict schema:

```yaml
id: "exam-ocp-01"
title: "Java OCP Exam 01"
lang: "fr" # fr | en — default/primary language for this exam
duration_minutes: 90
shuffle_questions: true
shuffle_options: true
difficulty: "mixed" # easy | medium | hard | mixed
tags: ["inheritance", "polymorphism"]
questions:
  - id: "ocp-01-001"
    title_fr: "Héritage et Polymorphisme"
    title_en: "Inheritance and Polymorphism"
    type: "multiple-choice" # single-choice | multiple-choice
    options:
      - label: "A"
        text_fr: "L'interface compile sans erreur."
        text_en: "The interface compiles without error."
      - label: "B"
        text_fr: "Une exception est levée à l'exécution."
        text_en: "An exception is thrown at runtime."
      - label: "C"
        text_fr: "Erreur de compilation à la ligne 4."
        text_en: "Compile error at line 4."
      - label: "D"
        text_fr: "Erreur de compilation à la ligne 5."
        text_en: "Compile error at line 5."
    correct_answers: ["C", "D"]
    explanation_fr: "..."
    explanation_en: "..."
```

Notes on the schema (enforced in `src/content.config.ts`):
- Questions are fully bilingual via `title_fr`/`title_en`, option `text_fr`/`text_en`, and `explanation_fr`/`explanation_en`. `exam.lang` is the default/primary; the user can switch FR/EN live during the exam and the choice is persisted.
- Each option is an object `{ label, text_fr, text_en }`. `label` is a short stable key (e.g. `A`, `B`) used by `correct_answers` and for shuffle/relabel mapping; the human text is in `text_fr`/`text_en`.
- `title_fr`/`title_en` and option text support a tiny markdown subset (inline `code` + fenced ``` blocks, Java-highlighted) rendered by `src/components/quiz/RichText.tsx`. No other markdown features.

Validation rules:
- Every exam must have a unique exam `id`.
- Every question must have a unique `id` within an exam.
- `type=single-choice` => exactly 1 correct answer.
- `type=multiple-choice` => 1..N correct answers.
- Option `label`s must be unique within a question.
- `correct_answers` values must exist in option `label`s.

## 7) Exam Runtime Behavior
- Timer policy: global countdown per exam (blocking end when 0)
- Navigation: free navigation (Previous/Next allowed)
- Shuffle: shuffle questions + options
- Scoring for multiple-choice: partial credit
- Pass threshold: 60%

### 7.1 Partial Credit Formula (locked)
For a question:
- Let C = set of correct options, U = set of user selected options.
- Precision-like score = |U intersect C| / |U| if |U| > 0 else 0.
- Recall-like score = |U intersect C| / |C|.
- Question score = (precision-like + recall-like) / 2.
- Clamp to [0, 1].

Notes:
- Selecting extra wrong options lowers score.
- Selecting only part of the correct set gives partial credit.
- Empty answer gives 0.

## 8) Result and Review Requirements
On submission (or timeout):
- Compute final percent score.
- Compute pass/fail using threshold 60%.
- Display detailed correction per question:
  - selected answers
  - correct answers
  - per-question score
  - explanation (FR/EN)

## 9) LocalStorage Requirements
Persist by exam and globally:
- Attempt history (unlimited retention)
- Timestamp, exam id, duration used, score percent, pass/fail
- Optional analytics fields: weak tags, avg score trend

Suggested keys:
- ocp.exam.attempts.v1 — attempt history (timestamp, exam id, exam title, duration used, score percent, pass/fail, question/answered counts)
- ocp.exam.settings.v1 — user settings (`preferredLang` for the FR/EN toggle)
- ocp.theme.v1 — dark mode preference (managed by `src/components/ThemeToggle.tsx`)

Keys are versioned (`v1`) for backward compatibility. The app tolerates empty or corrupted LocalStorage without crashing.

## 10) Phase-by-Phase Execution Contract

Phase status (V1 completion):
- [x] Phase 1 — Setup, content collection, base path, home listing
- [x] Phase 2 — React quiz engine (timer, navigation, shuffle, answer state)
- [x] Phase 3 — Evaluation and report (partial-credit formula, pass threshold 60%)
- [x] Phase 4 — LocalStorage persistence + progression view

V1 amendments (post-baseline, appended below the original sections):
- Section 4: code rendering in `title`/`options` (inline + fenced blocks).
- Dark mode toggle (header) persisted via `ocp.theme.v1` LocalStorage key.
- GitHub Actions deploy workflow at `.github/workflows/deploy.yml`.
- Bilingual question+option content (2026-07-05): question `title` and option text become fully bilingual via `title_fr`/`title_en` and per-option `text_fr`/`text_en` (mirroring the existing `explanation_*` pattern). `exam.lang` stays as the default/primary language. An FR/EN `LanguageToggle` is added during the exam (Quiz header) and reused in the Report; it switches question title, option text, and explanation live. The user's last choice is persisted via the existing `ocp.exam.settings.v1` key (`preferredLang`, previously dead code — now wired in). UI chrome strings remain French in V1; full UI chrome i18n is future work and intentionally out of scope here.

### Phase 1 - Setup and Routing
- Init Astro project with React + Tailwind.
- Configure Astro content collections for exams.
- Home page lists available exams from src/content/exams.
- Set `base: "/OCP-CERTIF-EXAM/"` in astro config.

Done criteria:
- App runs locally.
- Exam cards are generated from content files.
- Links work with base path.

### Phase 2 - Quiz Engine (React)
- Build interactive exam component.
- Implement global timer countdown.
- Previous/Next navigation and direct jump if needed.
- Store answers in React state during session.
- Apply shuffle policies.

Done criteria:
- Full exam can be completed end-to-end.
- Timer expiration triggers auto-submit.

### Phase 3 - Evaluation and Report
- Compare user answers with `correct_answers`.
- Apply partial-credit formula.
- Display final score and pass/fail.
- Render detailed per-question correction and explanations.

Done criteria:
- Results are deterministic and reproducible.
- Edge cases handled (unanswered, fully wrong, fully right, partial).

### Phase 4 - Persistence
- Save attempt history to LocalStorage.
- Build simple progression view on home or profile block.
- Keep backward-compatible schema versioning (`v1`).

Done criteria:
- Refreshing browser keeps historical attempts.
- No crash when LocalStorage is empty or corrupted.

## 11) Non-Functional Requirements
- Fully static output compatible with GitHub Pages.
- Mobile + desktop responsive UI.
- Accessibility baseline: labels, keyboard navigation, contrast.
- Deterministic parsing errors with clear messages for invalid frontmatter.

## 12) Out of Scope (for initial V1 unless requested)
- Backend/database
- User accounts
- Remote sync
- Proctoring/anti-cheat

## 13) Working Rules For Development
- This file is the source of truth for implementation choices.
- If a new requirement conflicts with this file, update this file first.
- Each phase implementation must map to the done criteria above.

## 14) First Dev Milestone Next
~~Start with Phase 1~~ (Done — all 4 phases shipped. See status in §10.)
