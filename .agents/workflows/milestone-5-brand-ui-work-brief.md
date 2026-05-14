# Milestone 5 Work Brief

## Goal

Define the first product presentation layer for Agent Doctor across CLI and future landing page.

## Scope

- Add lightweight CLI presentation polish:
  - ASCII brand header.
  - Optional terminal colors.
  - No color when output is not a TTY or `NO_COLOR` is set.
- Keep scan/init behavior unchanged.
- Define future landing page direction before creating a monorepo.

## Non-Goals

- No landing implementation yet.
- No monorepo migration yet.
- No animation that delays fast commands.
- No heavy CLI UI dependency.
- No changes to scanner, analyzer, or generator behavior.

## CLI Direction

- Use restrained colors for hierarchy.
- Keep plain text readable without color.
- Prefer static ASCII branding over loaders for fast commands.
- Avoid emojis in machine-facing command output.
- Preserve stable section order for future tests.

## Landing Direction

Build the landing after the CLI MVP commands are stable:

1. `scan`
2. `init`
3. `prescribe`

Recommended future structure:

```text
apps/web
packages/cli
```

## Acceptance Criteria

- `pnpm check` passes.
- `pnpm format:check` passes.
- CLI output remains readable without color.
- Color can be disabled through environment.
- No command behavior changes.
