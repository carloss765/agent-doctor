# Milestone 2 Work Brief

## Goal

Complete the base repository scanner so Agent Doctor returns a structured, deterministic, and testable view of the repository state.

This milestone closes the first repository readiness checks and prepares the input needed for analyzer and scoring work in Milestone 3.

## User Value

Users should be able to run `scan` and understand which base files, manifests, package manager signals, and validation scripts are present or missing before delegating work to coding agents.

## Scope

- Detect base files:
  - `README.md`
  - `AGENTS.md`
  - `.env.example`
  - `package.json`
  - `pyproject.toml`
  - `Cargo.toml`
- Detect Git by `.git/`.
- Detect package manager by lockfile:
  - `pnpm-lock.yaml`
  - `package-lock.json`
  - `yarn.lock`
  - `bun.lock`
  - `bun.lockb`
- Detect Node scripts from `package.json`:
  - `dev`
  - `build`
  - `test`
  - `lint`
  - `format`
- Return structured scanner data, not only formatted text.
- Keep `scan` strictly read-only.
- Update CLI output with:
  - `Repository`
  - `Found`
  - `Missing`
  - `Scripts detected`
  - `Missing scripts`
  - `Next steps`
- Add tests for empty, partial Node, and complete Node repositories.
- Keep `.env.example` in the repository with safe placeholders only.

## Non-Goals

- No readiness score yet.
- No analyzer module yet.
- No `init` command.
- No `.agent-doctor/report.md` or `.agent-doctor/report.json` generation.
- No `prescribe` command.
- No interactive mode.
- No framework detection.
- No external services or AI provider integration.

## Acceptance Criteria

- `pnpm test` passes.
- `pnpm check` passes.
- `pnpm dev -- scan` runs without errors.
- `scan` does not create, edit, or delete files.
- Scanner detects base files, Git, manifests, and package manager lockfiles.
- Scanner detects `dev`, `build`, `test`, `lint`, and `format` from `package.json`.
- Missing scripts are reported as missing and commands are not invented.
- Package manager remains `not detected` when no lockfile exists.
- Scanner logic can be tested without invoking the CLI.
- CLI output keeps stable sections and order.
- `.env.example` exists and contains no real secrets.

## Role Ownership

| Role             | Responsibility                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Project Manager  | Keeps scope focused on scanner completion and prevents scoring/generation creep.            |
| Product Designer | Reviews wording for detected scripts, missing scripts, and next steps.                      |
| Developer        | Implements extended detection, structured data, safe `package.json` parsing, and tests.     |
| DevOps Engineer  | Validates `pnpm check`, CI, build output, and local commands.                               |
| QA               | Validates fixtures, read-only behavior, deterministic output, and invalid package handling. |

## Subagent Flow

1. Project Manager confirms this scanner-focused scope.
2. Product Designer confirms output wording.
3. Developer implements scanner and formatter updates.
4. QA validates fixture coverage and read-only behavior.
5. DevOps Engineer runs package and CI checks.
6. Project Manager closes Milestone 2 and prepares scoring for Milestone 3.

## Proposed CLI Output Addition

```text
Scripts detected:
  - dev: pnpm dev
  - build: pnpm build

Missing scripts:
  - test
  - lint
  - format
```

## Validation Plan

- Run `pnpm test`.
- Run `pnpm check`.
- Run `pnpm dev -- scan`.
- Run `node dist/cli.js scan`.
- Confirm `scan` does not create `.agent-doctor/`.
- Confirm output order is stable across repeated runs.

## Risks

- `package.json` parsing must handle invalid JSON with a clear error.
- Empty scripts should not count as valid commands.
- Scanner should not recurse into large directories for Milestone 2 checks.
