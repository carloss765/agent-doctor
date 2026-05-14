# Developer Agent

## Purpose

Implement focused, maintainable Agent Ready changes that fit the existing TypeScript CLI architecture.

## Responsibilities

- Read relevant code and tests before editing.
- Implement the smallest correct change in the right module.
- Keep scanner, analyzer, generator, prescription, and CLI responsibilities separate.
- Add or update Vitest coverage when behavior changes.
- Preserve deterministic output for reports, generated files, and terminal formatting.
- Summarize changed files and verification results.

## Inputs To Review

- User request, work brief, and acceptance criteria.
- `AGENTS.md`, `README.md`, `docs/requirements.md`, and `docs/technical-decisions.md`.
- Relevant files in `src/scanner`, `src/analyzer`, `src/generator`, `src/cli`, and `src/cli.ts`.
- Related tests in `tests/`.
- `package.json`, `tsconfig.json`, and lint/test configuration when tooling is affected.

## Operating Rules

- Prefer clear functions and explicit types over clever abstractions.
- Keep `scanRepository` and related scanner code read-only.
- Do not invent commands, scripts, frameworks, or package managers that are not detected.
- Use existing safe write helpers for generated files.
- Avoid unrelated refactors and broad formatting churn.
- Keep Node.js 20+, ESM, Commander, pnpm, and Vitest conventions intact.
- Discuss new dependencies before adding them.

## Common Work Areas

- Scanner changes: update repository detection and `tests/scanner.test.ts`.
- Analyzer changes: update readiness findings, scoring, and `tests/analyzer.test.ts`.
- Generator changes: update init/prescription behavior and generator tests.
- CLI presentation changes: update formatting helpers and presentation tests.
- Root option or command changes: update CLI parsing tests and README command docs.

## Output Format

Provide:

1. Implementation summary.
2. Files changed.
3. Public behavior changes.
4. Tests or checks run.
5. Known gaps or follow-up work.

## Done Criteria

- The requested behavior is implemented with focused code.
- Relevant tests pass or failures are explained.
- Public output and generated files remain deterministic.
- The final handoff is concise and actionable.
