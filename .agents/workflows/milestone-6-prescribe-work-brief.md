# Milestone 6 Work Brief

## Goal

Implement `agent-ready prescribe` to generate a prompt-style prescription for an external coding agent.

## Scope

- Add `prescribe` command.
- Generate `.agent-ready/prescription.md`.
- Use scanner and analyzer output.
- Include score, status, found files, missing files, detected scripts, missing scripts, next steps, and safety rules.
- Do not overwrite an existing prescription by default.
- Support `--yes` for non-interactive execution.

## Non-Goals

- No report generation.
- No `--force`.
- No agent-specific variants yet.
- No interactive mode.
- No external AI provider integration.

## Acceptance Criteria

- `pnpm test` passes.
- `pnpm check` passes.
- `prescribe` creates `.agent-ready/prescription.md` when missing.
- `prescribe` skips existing `.agent-ready/prescription.md`.
- Output separates `Created`, `Skipped`, and `Next steps`.
- Generated content is deterministic for equivalent repositories.
- The command does not modify unrelated files.
- Path errors are clear and do not show raw stack traces.

## Validation Plan

- Run `pnpm check`.
- Run `pnpm format:check`.
- Run `node dist/cli.js prescribe --root <temp-dir> --yes`.
- Run the command twice to verify no-overwrite behavior.
