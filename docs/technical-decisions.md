# Technical Decisions

## Purpose

This document records the initial technical agreement for Agent Ready.

The goal is to keep the project simple, maintainable, and easy for contributors and AI coding agents to understand.

## Product Context

Agent Ready is an open source CLI that checks whether a repository is ready to be worked on by coding agents.

The MVP should:

- Scan a repository.
- Detect missing agent-readiness files and documentation.
- Generate safe base files.
- Produce clear prescriptions for external coding agents.

The MVP should not:

- Provide its own AI model.
- Require API keys.
- Depend on hosted services.
- Make risky changes without user approval.

## Decision Criteria

Technology choices should be evaluated using these criteria:

- Simple local development.
- Fast CLI startup.
- Strong TypeScript support.
- Easy npm distribution.
- Low operational cost.
- Clear testing strategy.
- Familiar tooling for contributors.
- Good compatibility with coding agents.

## Approved Technology Stack

| Area            | Decision       | Rationale                                                                             |
| --------------- | -------------- | ------------------------------------------------------------------------------------- |
| Language        | TypeScript     | Strong typing improves maintainability and helps agents reason about code safely.     |
| Runtime         | Node.js        | Best fit for an npm-distributed CLI.                                                  |
| Package manager | pnpm           | Fast installs, strict dependency behavior, and good monorepo support if needed later. |
| CLI framework   | Commander      | Simple, mature, and enough for `scan`, `init`, and `prescribe`.                       |
| Testing         | Vitest         | Fast test runner with good TypeScript support.                                        |
| Formatting      | Prettier       | Keeps formatting consistent with minimal discussion.                                  |
| Linting         | ESLint         | Catches common TypeScript and JavaScript issues.                                      |
| Distribution    | npm package    | Matches the expected usage: `npx @agent-ready/cli`.                                   |
| CI              | GitHub Actions | Standard choice for open source validation and release checks.                        |

## Initial Recommendation

Start with:

```text
TypeScript
Node.js
pnpm
Commander
Vitest
Prettier
ESLint
GitHub Actions
npm package distribution
```

Avoid adding frameworks, databases, hosted services, or AI provider SDKs in the MVP.

Milestone 1 uses Commander and ESM package output.

## Architecture Direction

The CLI should be organized around small modules:

- Scanner: detects repository files, package manager, scripts, framework, language, and Git status.
- Analyzer: converts scan results into readiness findings.
- Generator: creates base files from templates.
- Prescription builder: writes prompts and next steps for external coding agents.
- CLI entrypoint: handles commands, flags, and user interaction.

Each module should have one clear responsibility.

## Proposed Commands

```bash
npx @agent-ready/cli scan
npx @agent-ready/cli init
npx @agent-ready/cli prescribe
```

Optional aliases can be added later:

```bash
npx @agent-ready/cli check
npx @agent-ready/cli fix
npx @agent-ready/cli prompt
```

## Working Agreement

- Keep changes small and reviewable.
- Prefer boring, proven tools over complex abstractions.
- Do not add dependencies without a clear reason.
- Document new commands in `README.md`.
- Add or update tests when behavior changes.
- Do not commit secrets, `.env` files, tokens, or private keys.
- Discuss changes that affect architecture, distribution, security, or public CLI behavior before implementing them.

## Pull Request Expectations

Each pull request should include:

- Summary of the change.
- Files or modules affected.
- Validation commands run.
- Any known limitations or follow-up work.

## Decisions Closed In Milestone 1

| Decision      | Outcome        | Rationale                                                           |
| ------------- | -------------- | ------------------------------------------------------------------- |
| CLI framework | Commander      | Simple API, mature package, and enough for the expected commands.   |
| Package type  | ESM            | Fits modern Node.js and keeps imports explicit with `NodeNext`.     |
| CI timing     | Milestone 1    | Small workflow protects the scaffold from the beginning.            |
| Build tool    | TypeScript CLI | Avoids an extra bundler dependency while the package remains small. |

## Open Decisions

These decisions should be finalized before or during the first implementation increment:

| Decision        | Options                               | Notes                                                  |
| --------------- | ------------------------------------- | ------------------------------------------------------ |
| Template format | Markdown files, embedded strings      | Prefer file-based templates if they stay easy to test. |
| Release flow    | Manual npm publish, automated release | Manual is acceptable for MVP.                          |

## Review Cadence

Review this document when:

- A new core dependency is proposed.
- The CLI command structure changes.
- Distribution or release flow changes.
- The project moves beyond MVP scope.
