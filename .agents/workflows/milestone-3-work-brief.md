# Milestone 3 Work Brief

## Goal

Add the first analyzer layer for Agent Ready: convert `ScanResult` into deterministic readiness findings, score, status, and next-step recommendations.

## User Value

Users should understand how ready a repository is for coding agents, not only which files and scripts were detected.

## Scope

- Add an analyzer module that accepts `ScanResult`.
- Calculate an agent readiness score from `0` to `100`.
- Add readiness status labels:
  - `Ready`
  - `Almost ready`
  - `Needs setup`
  - `Not ready`
- Include analyzer output in the `scan` command.
- Keep analyzer logic pure and testable without the CLI.
- Add tests for empty, partial, almost ready, and complete repositories.
- Keep `scan` strictly read-only.

## Non-Goals

- No `init` command.
- No `.agent-ready/report.md` or `.agent-ready/report.json` writing.
- No `prescribe` command.
- No interactive mode.
- No framework detection.
- No external AI provider integration.

## Acceptance Criteria

- `scan` output includes `Agent readiness`, `Score`, and `Status`.
- Score is deterministic for the same `ScanResult`.
- Status mapping is:
  - `0`: `Not ready`
  - `1-49`: `Needs setup`
  - `50-79`: `Almost ready`
  - `80-100`: `Ready`
- Analyzer can be tested without invoking the CLI.
- `scan` does not create, edit, or delete files.
- `pnpm check` passes.
- `pnpm format:check` passes.

## Suggested Score Model

| Signal                    | Points |
| ------------------------- | ------ |
| `README.md`               | 15     |
| `AGENTS.md`               | 20     |
| `.env.example`            | 10     |
| Project manifest          | 10     |
| Git repository            | 10     |
| Package manager lockfile  | 10     |
| `build` script            | 10     |
| `test` script             | 10     |
| `lint` or `format` script | 5      |

Total: `100`.

## Role Ownership

| Role             | Responsibility                                                  |
| ---------------- | --------------------------------------------------------------- |
| Project Manager  | Keeps scope focused on analyzer and score only.                 |
| Product Designer | Reviews score/status wording and CLI hierarchy.                 |
| Developer        | Implements analyzer, CLI integration, and tests.                |
| DevOps Engineer  | Validates scripts, build, and CI.                               |
| QA               | Validates score scenarios, determinism, and read-only behavior. |

## Validation Plan

- Run `pnpm test`.
- Run `pnpm check`.
- Run `pnpm format:check`.
- Run `node dist/cli.js scan`.
- Confirm `scan` does not create `.agent-ready/`.
