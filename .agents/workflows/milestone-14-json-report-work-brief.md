# Milestone 14: Stable JSON Report Output

## Goal

Add a versioned, deterministic JSON report for `agent-ready scan` so other tools and CI systems can consume Agent Ready output without scraping terminal text.

## User Value

Users can automate repository readiness checks, store structured results, and build later workflows on a stable output contract while keeping Agent Ready local-first and explicit.

## Scope

- Add machine-readable scan output, preferably `agent-ready scan --json`.
- Add a report formatter module for a versioned JSON shape such as `ReportJsonV1`.
- Include scan facts, readiness analysis, findings, detected commands, detected agent tools, skills, and recommendations.
- Include schema metadata such as `schemaVersion` and `toolVersion`.
- Keep human-readable `scan` output unchanged unless needed for flag discoverability.
- Keep output deterministic for the same repository state.
- Avoid secrets, environment values, file contents, dependency trees, timestamps, or non-deterministic values.

## Non-Goals

- Do not bump or publish the npm package in this milestone.
- Do not add hosted reporting, uploads, dashboards, telemetry, or external services.
- Do not add CI exit-code behavior yet; that belongs to Milestone 15.
- Do not expand framework or language detection beyond current scan facts.
- Do not add dependencies unless explicitly approved.

## Acceptance Criteria

- `agent-ready scan --json` prints valid JSON to stdout.
- JSON mode does not print banners, color codes, progress text, or debug logs.
- The JSON includes `schemaVersion`, `toolVersion`, repository summary, readiness summary, findings, commands, agent tools, skills, and recommendations.
- The same repository state produces the same JSON, except for fields explicitly documented as variable. Prefer no variable fields in this milestone.
- Existing `agent-ready scan` human output still works.
- JSON field names and enum values are documented in tests or types.
- Errors still use stderr and a non-zero exit code.
- `pnpm check` and `pnpm format:check` pass.

## Owner

Primary role: Developer Agent

## Required Reviewers

- Project Manager Agent: confirm the JSON schema is a stable public contract and does not expand scope.
- Product Designer Agent: review naming, status values, and discoverability in the root command.
- QA Agent: validate parseable stdout, determinism, schema shape, and regression risk.

## Files Or Areas

- `src/cli.ts`
- `src/scanner/types.ts`
- `src/analyzer/types.ts`
- `src/cli/formatCommandList.ts`
- `src/reporter/` or equivalent new report module
- `tests/cliPresentation.test.ts`
- New report formatter tests if a new module is added
- `README.md`
- `docs/requirements.md`

## Validation Plan

- `pnpm format:check`
- `pnpm check`
- Smoke: `node dist/cli.js scan --json` emits parseable JSON after build.
- Smoke: `node dist/cli.js scan` keeps the current human output.
- Determinism check: run `scan --json` twice on the same fixture and compare parsed output.

## Risks

- Risk: JSON becomes a public contract too early and is hard to change later.
  Mitigation: version the schema immediately and keep the first shape small.
- Risk: progress output or color codes corrupt JSON stdout.
  Mitigation: suppress progress/color in JSON mode and test raw stdout.
- Risk: report leaks local secrets or file contents.
  Mitigation: include file paths and status values only; never include `.env` contents.
- Risk: absolute paths make fixture tests brittle.
  Mitigation: assert shape and normalize root paths in tests when needed.
