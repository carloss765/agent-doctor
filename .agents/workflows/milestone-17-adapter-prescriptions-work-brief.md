# Milestone 17: Adapter-Specific Prescriptions

## Goal

Generate deterministic prescription files tailored for Codex, Claude Code, and OpenCode while preserving the existing universal prescription.

## User Value

Users can hand the right file to the coding agent they actually use, with guidance that references the correct local conventions and avoids irrelevant setup instructions.

## Scope

- Add `agent-ready prescribe --agent <agent>`.
- Supported values: `universal`, `codex`, `claude`, `opencode`, and `all`.
- Keep current `agent-ready prescribe` behavior as universal output to `.agent-ready/prescription.md`.
- Generate adapter files:
  - `.agent-ready/prescription.codex.md`
  - `.agent-ready/prescription.claude.md`
  - `.agent-ready/prescription.opencode.md`
- Refactor prescription rendering so shared sections are centralized and adapter sections are small.
- Include adapter detection evidence when available.
- Allow generation when an adapter is not detected, but say it was generated from a generic adapter template.
- Fail clearly for unsupported adapter values.

## Non-Goals

- Do not call vendor APIs or run AI models.
- Do not create adapter setup files such as `CLAUDE.md`, `.claude/commands/*`, or `opencode.jsonc`.
- Do not overwrite existing prescription files.
- Do not change `init` behavior.
- Do not publish package changes in this milestone.

## Acceptance Criteria

- `agent-ready prescribe` keeps creating `.agent-ready/prescription.md`.
- `agent-ready prescribe --agent codex` creates `.agent-ready/prescription.codex.md`.
- `agent-ready prescribe --agent claude` creates `.agent-ready/prescription.claude.md`.
- `agent-ready prescribe --agent opencode` creates `.agent-ready/prescription.opencode.md`.
- `agent-ready prescribe --agent all` creates all adapter prescriptions and the universal one, using safe write behavior.
- Unsupported adapters fail with: `Unsupported agent: <name>. Supported agents: universal, codex, claude, opencode, all.`
- Existing files are skipped and not overwritten.
- Every prescription includes the shared safety rules.
- Tests cover adapter selection, unsupported adapter handling, detected/not-detected evidence, and no-overwrite behavior.
- `pnpm check` and `pnpm format:check` pass.

## Owner

Primary role: Developer Agent

## Required Reviewers

- Product Designer Agent: review generated Markdown structure and terminal next steps.
- QA Agent: validate golden outputs, adapter selection, and safe writes.
- Project Manager Agent: confirm adapter scope does not become setup-file generation.

## Files Or Areas

- `src/generator/prescribeProject.ts`
- `src/generator/types.ts`
- New `src/prescription/` module if useful
- `src/cli.ts`
- `src/cli/formatPrescribeResult.ts`
- `src/cli/formatCommandList.ts`
- `tests/prescribeProject.test.ts`
- `tests/cliPresentation.test.ts`
- `README.md`
- `docs/requirements.md`

## Validation Plan

- `pnpm format:check`
- `pnpm check`
- Smoke: `node dist/cli.js prescribe --agent codex --yes` creates/skips the Codex prescription.
- Smoke: `node dist/cli.js prescribe --agent all --yes` creates/skips all expected files.
- Smoke: `node dist/cli.js prescribe --agent unknown --yes` fails with clear unsupported-agent wording.

## Risks

- Risk: adapter guidance gets stale or overclaims vendor behavior.
  Mitigation: keep guidance based on local files and stable repository conventions.
- Risk: adapter sections duplicate shared content.
  Mitigation: centralize shared prescription sections.
- Risk: users expect `prescribe --agent claude` to create `CLAUDE.md`.
  Mitigation: terminal output must explain this writes a prescription only.
- Risk: safe write behavior is bypassed by multiple outputs.
  Mitigation: route all generated files through `writeIfMissing`.
