# Milestone 9 Work Brief

## Goal

Detect agent tool configuration and local skill directories during `scan`.

## Scope

- Detect common agent tool signals:
  - Codex: `AGENTS.md`, `.agents`
  - Claude Code: `CLAUDE.md`, `.claude`
  - OpenCode: `opencode.jsonc`, `opencode.json`
  - Cursor: `.cursor`, `.cursorrules`
  - Windsurf: `.windsurf`, `.windsurfrules`
- Detect local skill directories:
  - `.agents/skills`
  - `.claude/skills`
- Show detected tools and skills in scan output.
- Include detected tools and skills in prescriptions.

## Non-Goals

- No remote skill discovery.
- No installing skills.
- No scoring penalty for missing skills.
- No agent-specific prescription variants yet.

## Acceptance Criteria

- `pnpm check` passes.
- `pnpm format:check` passes.
- `scan` reports detected agent tools.
- `scan` reports detected local skill directories and counts.
- Projects without skills are not treated as failures.
