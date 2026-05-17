# Technical Decisions

This document records the current technical agreement for Agent Ready.

## Product Boundary

Agent Ready is a local-first CLI that prepares repositories for external coding agents.

It should:

- scan a local repository;
- detect context, command, safety, and setup gaps;
- generate safe starter files and prescriptions;
- keep output deterministic and easy to test.

It should not:

- run an AI model;
- require API keys, accounts, telemetry, or hosted services;
- upload repository contents;
- execute the target project's install, build, test, lint, or format commands;
- overwrite existing files without explicit command behavior.

## Approved Stack

- TypeScript
- Node.js 20+
- ESM
- pnpm
- Commander
- Vitest
- Prettier
- ESLint
- npm package distribution as `@agent-ready/cli`

## Architecture

Keep modules small and focused:

- `src/scanner`: repository inspection only.
- `src/analyzer`: readiness scoring, findings, status, and next steps.
- `src/reporter`: stable machine-readable report formatting.
- `src/generator`: safe file generation and prescriptions.
- `src/cli`: terminal presentation, parsing, and command wiring.

`scan` must remain read-only. Generated files must use safe write behavior.

## Public Behavior Rules

Changes to commands, flags, output wording, generated filenames, score semantics, JSON schema, or
exit codes are public behavior changes and need tests plus README updates.

Current public commands:

```bash
npx @agent-ready/cli scan
npx @agent-ready/cli scan --json
npx @agent-ready/cli scan --ci --min-score 80
npx @agent-ready/cli init
npx @agent-ready/cli prescribe
```

## Open Decisions

- Adapter-specific prescription shape for Codex, Claude Code, and OpenCode.
- Whether new framework and language signals affect score or remain informational first.
- Local policy config filename and schema.
- Baseline/diff report format.
