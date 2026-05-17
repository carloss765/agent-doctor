# Milestone 16: Richer Node.js Framework Detection

## Goal

Improve local detection of common Node.js frameworks and project shapes using high-signal package and config evidence.

## User Value

Users get more accurate repository context and more useful recommendations because Agent Ready can explain which framework signals it found instead of only reporting generic Node.js files.

## Scope

- Add framework signals to the scanner result.
- Detect common Node.js frameworks and tools from `package.json` dependencies/devDependencies and known config files.
- Initial target set: Next.js, Vite, Astro, Remix, Nuxt, SvelteKit, Express, Fastify, NestJS, React, Vitest, Jest, Playwright.
- Include evidence paths such as `package.json`, `next.config.js`, `vite.config.ts`, or `astro.config.mjs`.
- Update human scan output to show frameworks with evidence.
- Update JSON report output to include framework signals.
- Keep unknown projects graceful: `Frameworks: not detected`.

## Non-Goals

- Do not crawl large source trees.
- Do not infer frameworks from README text alone.
- Do not penalize unsupported or unknown frameworks as readiness failures by default.
- Do not add non-Node language expansion in this milestone.
- Do not add dependency installation, lockfile parsing, or network calls.

## Acceptance Criteria

- Scanner reports deterministic framework signals with name, status, and evidence.
- Multiple frameworks/tools can be reported together.
- Detection prefers declared dependencies and known config files over weak source hints.
- Human scan output includes a concise frameworks section.
- JSON report includes frameworks in a stable schema.
- Fixture tests cover representative projects for the initial target set.
- Ambiguous or absent framework signals return `not detected` instead of guessing.
- `scan` remains read-only.
- `pnpm check` and `pnpm format:check` pass.

## Owner

Primary role: Developer Agent

## Required Reviewers

- Product Designer Agent: review framework wording, evidence display, and unknown states.
- QA Agent: validate fixture coverage, ambiguity cases, and deterministic ordering.
- Project Manager Agent: confirm this remains Node-focused and does not expand language scope.

## Files Or Areas

- `src/scanner/types.ts`
- `src/scanner/scanRepository.ts`
- `src/cli/formatScanResult.ts`
- Report formatter from Milestone 14
- `src/generator/prescribeProject.ts` only if prescriptions include framework facts
- `tests/scanner.test.ts`
- `tests/cliPresentation.test.ts`
- Report tests
- `README.md`
- `docs/requirements.md`

## Validation Plan

- `pnpm format:check`
- `pnpm check`
- Fixture tests for dependencies-only detection.
- Fixture tests for config-file detection.
- Fixture tests for absent and mixed frameworks.
- Read-only test around framework detection.

## Risks

- Risk: false positives from incidental dependencies.
  Mitigation: classify evidence clearly and prefer strong signals.
- Risk: output order changes across filesystems.
  Mitigation: define framework order in code and test it.
- Risk: scope expands into full source analysis.
  Mitigation: limit this milestone to root config files and `package.json`.
- Risk: framework detection strains `ScanResult`.
  Mitigation: add a small typed `frameworks` array instead of overloading existing fields.
