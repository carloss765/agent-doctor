# Milestone 1 Work Brief

## Goal

Create the initial TypeScript CLI scaffold for Agent Doctor and deliver a working read-only `scan` command.

## User Value

Users should be able to run the CLI against a repository and see an initial diagnosis without any files being modified.

## Scope

- Create the TypeScript project scaffold.
- Configure `pnpm`.
- Add package scripts for development, build, test, lint, and format.
- Add a CLI entrypoint.
- Implement a basic read-only `scan` command.
- Detect a small first set of repository signals:
  - `README.md`
  - `AGENTS.md`
  - `.env.example`
  - `package.json`
  - Git directory
  - package manager lockfile
- Add Vitest tests for scanner behavior.

## Non-Goals

- No interactive mode yet.
- No file generation yet.
- No prescriptions yet.
- No agent-specific setup files yet.
- No external AI provider integration.

## Acceptance Criteria

- `pnpm install` installs dependencies.
- `pnpm dev -- scan` or equivalent runs the local CLI.
- `pnpm build` compiles the project.
- `pnpm test` runs scanner tests.
- `scan` does not create, edit, or delete files.
- CLI output separates found items from missing items.
- Scanner logic is testable without invoking the full CLI.

## Role Ownership

| Role             | Responsibility                                                               |
| ---------------- | ---------------------------------------------------------------------------- |
| Project Manager  | Confirms scope, non-goals, and acceptance criteria.                          |
| Product Designer | Reviews CLI wording and output structure.                                    |
| Developer        | Implements scaffold, scanner, CLI command, and tests.                        |
| DevOps Engineer  | Configures scripts, package metadata, build, lint, format, and CI direction. |
| QA               | Defines scanner scenarios and validates read-only behavior.                  |

## Subagent Flow

1. Project Manager opens the task with this brief.
2. Product Designer proposes terminal output wording.
3. Developer implements the scaffold and scanner.
4. DevOps Engineer reviews scripts and build setup.
5. QA runs validation against the acceptance criteria.
6. Project Manager summarizes status and next milestone.

## Proposed CLI Output Shape

```text
Agent Doctor

Scanning repository...

Found:
- README.md
- package.json
- Git repository

Missing:
- AGENTS.md
- .env.example

Next steps:
- Run agent-doctor init to generate missing base files.
```

## Validation Plan

- Run `pnpm build`.
- Run `pnpm test`.
- Run local `scan` command against this repository.
- Confirm no generated files are created by `scan`.

## Risks

- The initial scanner may over-detect frameworks if it guesses from weak signals.
- Package setup may need adjustment before npm publishing.
- CLI framework choice must be finalized before implementation.

## Decisions Closed During Implementation

- CLI framework: `Commander`.
- Package output: ESM.
- CI: included in Milestone 1.
- Build: TypeScript compiler without an extra bundler.
