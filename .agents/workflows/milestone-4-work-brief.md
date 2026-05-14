# Milestone 4 Work Brief

## Goal

Implement `agent-ready init` as a small, safe file-generation command.

The command should prepare missing base files for coding agents without overwriting existing user work.

## Scope

- Add `init` command.
- Create `AGENTS.md` when missing.
- Create `.env.example` when missing.
- Support `--yes` for non-interactive execution.
- Report created and skipped files.
- Keep templates simple and free of secrets.
- Keep `scan` read-only.

## Non-Goals

- No overwrite behavior.
- No `--force`.
- No interactive file-by-file selection.
- No `README.md` generation.
- No `package.json` modification.
- No dependency installation.
- No CI generation.
- No `.agent-ready/report.md` or `.agent-ready/report.json` generation.
- No scoring changes.
- No external AI or hosted services.

## Acceptance Criteria

- `pnpm test` passes.
- `pnpm check` passes.
- `init` creates `AGENTS.md` and `.env.example` when missing.
- `init` does not overwrite existing files.
- Output separates `Created`, `Skipped`, and `Next steps`.
- Generated files contain useful safe defaults.
- `.env` is never created.
- Path errors are clear and do not show raw stack traces.
- `--yes` is accepted for non-interactive use.

## Role Ownership

| Role             | Responsibility                                               |
| ---------------- | ------------------------------------------------------------ |
| Project Manager  | Keeps scope limited to safe base file generation.            |
| Product Designer | Reviews `init` output wording.                               |
| Developer        | Implements command, templates, safe writes, and tests.       |
| QA               | Validates generation, no-overwrite, idempotence, and errors. |
| DevOps Engineer  | Validates build, CLI bin, and CI checks.                     |

## Validation Plan

- Run `pnpm test`.
- Run `pnpm check`.
- Run `pnpm format:check`.
- Run `node dist/cli.js init --root <temp-dir> --yes`.
- Confirm existing files are skipped.
