# Milestone 7 Work Brief

## Goal

Make the default CLI entrypoint useful for `npx agent-doctor`.

## Scope

- Run `scan` when no subcommand is provided.
- Keep `scan`, `init`, and `prescribe` subcommands available.
- Keep default behavior read-only.
- Document local default usage.

## Non-Goals

- No interactive menu yet.
- No package publishing yet.
- No npm release automation.

## Acceptance Criteria

- `agent-doctor` runs a read-only scan by default.
- `agent-doctor scan` keeps working.
- `agent-doctor init` keeps working.
- `agent-doctor prescribe` keeps working.
- `pnpm check` passes.
- `pnpm format:check` passes.
