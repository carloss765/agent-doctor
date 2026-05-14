# Milestone 8 Work Brief

## Goal

Prepare Agent Ready for npm publication.

## Scope

- Add npm package metadata.
- Add `LICENSE`.
- Add publish safety scripts.
- Add publishing documentation.
- Validate package contents with `npm pack --dry-run`.

## Non-Goals

- No actual npm publish.
- No release automation.
- No GitHub release creation.
- No landing page deployment.

## Acceptance Criteria

- `pnpm check` passes.
- `pnpm format:check` passes.
- `npm pack --dry-run` succeeds.
- Package includes only intended files.
- Publishing steps are documented.
