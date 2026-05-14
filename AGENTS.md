# Repository Guidelines

## Project Structure & Module Organization

This repository is currently in the planning stage for **Agent Doctor**, an open source Node.js CLI that checks whether a project is ready for coding agents.

- `README.md`: product overview, proposed CLI behavior, and command examples.
- `docs/technical-decisions.md`: approved stack, architecture direction, and contribution expectations.
- Future source code should live under `src/`, with focused modules such as `scanner`, `analyzer`, `generator`, `prescription`, and `cli`.
- Future tests should live beside the code as `*.test.ts` or in `tests/` when broader integration coverage is needed.
- Generated local reports should use `.agent-doctor/` and should not be committed unless intentionally documented as fixtures.

## Build, Test, and Development Commands

The implementation scaffold is not present yet. When added, prefer the approved stack: TypeScript, Node.js, pnpm, Vitest, Prettier, and ESLint.

Expected commands:

```bash
pnpm install      # install dependencies
pnpm dev          # run the CLI locally during development
pnpm build        # compile TypeScript for distribution
pnpm test         # run the Vitest suite
pnpm lint         # run ESLint checks
pnpm format       # apply Prettier formatting
```

Document any new command in `README.md` when adding it.

## Coding Style & Naming Conventions

Write TypeScript with clear, small modules and descriptive names. Prefer simple functions over broad abstractions. Keep files focused; aim for roughly 200-250 lines.

Use `camelCase` for variables and functions, `PascalCase` for types/classes, and kebab-case for CLI-facing names such as `agent-doctor`. Follow Prettier once configured. Avoid dependencies unless they solve a real problem.

## Testing Guidelines

Use Vitest for unit and integration tests. Test behavior, not implementation details. Name tests after the behavior under test, for example `scanner detects package manager`.

Add or update tests whenever CLI behavior, generated files, parsing, or analysis rules change. For generators, include fixture tests for file content and overwrite behavior.

## Commit & Pull Request Guidelines

Current history only shows `first commit`, so no strict commit convention is established. Use short, imperative commit messages such as `Add scanner module` or `Document init command`.

Pull requests should include a concise summary, affected files or modules, validation commands run, linked issues when relevant, and terminal output for user-facing CLI changes.

## Security & Agent-Specific Instructions

Do not commit secrets, `.env` files, tokens, or private keys. Agent Doctor should not require API keys or hosted services for the MVP. Discuss changes that affect architecture, distribution, security, or public CLI behavior before implementation.
