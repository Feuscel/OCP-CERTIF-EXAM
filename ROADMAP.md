# ROADMAP — OCP-CERTIF-EXAM

Agreed plan from 2026-07-15 grill-me session.

## Key Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | README frontmatter example | Fix to bilingual format (`title_fr`/`title_en`, `label`/`text_fr`/`text_en`) |
| 2 | Test framework | **Vitest** |
| 3 | `scripts/` status | **Keep + fix** (not throw away) |
| 4 | Content creation workflow | **Automated extraction** from external sources |
| 5 | Sources | **ocpj21-book** (eh3rrera/ocpj21-book) + manual curation |
| 6 | Bilingualism | Extract **EN**, manual translation of `_fr` fields |
| 7 | Chapter coverage | **Progressive** (2 → 5 → 10 → 21) |
| 8 | First test target | **scoring.ts** |
| 9 | End-to-end pipeline | Extract → Validate Java snippets → PR → Translate → Merge → Build |
| 10 | Extractor architecture | **Pattern matching (regex)**, better structured |

## Workflow Rules

- **One branch per phase.** Each phase gets its own branch and PR.
- **Never start a phase until the previous phase is merged to main.**
- Verify `git log main` contains the previous phase's merge commit before checking out a new branch.
- Commit messages follow Conventional Commits (`feat(scope): ...`, `fix(scope): ...`).

## Phases

### Phase 1 — Test foundations
- `pnpm add -D vitest`
- Unit tests for `scoring.ts`: single-choice, multiple-choice, partial credit, empty, fully correct, fully wrong
- `pnpm test` script in `package.json`
- `test` step in `.github/workflows/deploy.yml` (before build)

### Phase 2 — Fix scripts/
- `scripts/extract-questions.mjs`:
  - Remove dead code (`escapeYaml`)
  - Add `--chapter` CLI parameter
  - Make `CHAPTERS` configurable (not hardcoded)
  - Fix `buildQuestionTitle` (ignores `code` param)
- `scripts/verify-answers.mjs`:
  - Replace `globSync` from `fs` (doesn't exist) with `fs.readdirSync` + filter or `glob` package
  - Parameterize hardcoded absolute paths
  - Make chapter configurable

### Phase 3 — Unit test coverage (shuffle, storage, highlightJava, schema)
- `shuffle.ts`: test with mocked `Math.random`, verify `displayLabel` ↔ `originalLabel` mapping stability
- `storage.ts`: test `safeParse`, `loadAttempts`, `saveAttempt`, `summarizeAttempts` with mocked localStorage
- `highlightJava.tsx`: tokenize keywords, strings, comments, annotations, numbers, types
- `content.config.ts`: validate `superRefine` rules (duplicate ids, missing options, wrong answer count)

### Phase 4 — Batch extraction (chapters 3-5)
- Run fixed extractor for chapters 3, 4, 5
- Run fixed `verify-answers.mjs` to compile/validate Java snippets
- Open PRs with generated content
- Manual FR translation of `_fr` fields
- Merge → Build → Deploy

### Phase 5 — Iteration (chapters 6-21)
- Repeat Phase 4 pattern in batches of 3-5 chapters
- Tweak extractor if new formatting patterns appear

## Phase Progress
- [ ] Phase 1 — Test foundations (Vitest + scoring tests)
- [ ] Phase 2 — Fix scripts/
- [ ] Phase 3 — Unit test coverage
- [ ] Phase 4 — Batch extraction (chapters 3-5)
- [ ] Phase 5 — Iteration (chapters 6-21)
