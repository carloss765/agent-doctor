# Milestone 15: CI-Friendly Scan Mode

## Goal

Add a non-interactive CI mode for `agent-ready scan` with deterministic output and exit codes based on configured readiness criteria.

## User Value

Teams can run Agent Ready in pull requests and build pipelines to catch missing repository context before coding agents are asked to work on the project.

## Scope

- Add `agent-ready scan --ci`.
- Add a minimum score option, preferably `--min-score <number>`, with clear validation.
- Support combining CI mode with JSON output from Milestone 14, for example `agent-ready scan --ci --json`.
- Print compact human CI output when `--json` is not used.
- Disable progress indicators, prompts, and color in CI mode unless color is explicitly requested later.
- Define exit codes for pass, configured readiness failure, and scan/runtime error.
- Keep `scan` read-only.

## Non-Goals

- Do not add GitHub Actions, GitLab CI, or vendor-specific integrations.
- Do not write report files unless an explicit output flag exists in a later milestone.
- Do not run install, build, test, lint, format, or any project command.
- Do not change scoring rules unless required and reviewed.
- Do not add network calls, hosted services, or telemetry.

## Acceptance Criteria

- `agent-ready scan --ci` completes without prompts, spinners, or file writes.
- `agent-ready scan --ci --min-score 80` exits `0` when the score is at least `80`.
- `agent-ready scan --ci --min-score 80` exits non-zero when the score is below `80`.
- Scan/runtime errors remain distinct from readiness threshold failures in output and exit behavior.
- CI output includes score, status, required minimum, result, reason when failed, and `No files were modified.`
- `agent-ready scan --ci --json` emits parseable JSON only on stdout and still sets the correct exit code.
- Root command discoverability mentions CI examples.
- `pnpm check` and `pnpm format:check` pass.

## Owner

Primary role: Developer Agent

## Required Reviewers

- Project Manager Agent: confirm exit-code semantics and default threshold behavior.
- Product Designer Agent: review compact CI wording and result states.
- QA Agent: validate pass/fail/error scenarios and stdout/stderr separation.
- DevOps Engineer Agent: review CI ergonomics and package script impact.

## Files Or Areas

- `src/cli.ts`
- `src/cli/formatCommandList.ts`
- `src/cli/formatScanResult.ts` or new CI formatter
- `src/cli/exitCode.ts` or equivalent helper if useful
- Report formatter from Milestone 14
- `tests/cliPresentation.test.ts`
- CLI integration or smoke tests if added
- `README.md`
- `docs/requirements.md`

## Validation Plan

- `pnpm format:check`
- `pnpm check`
- Smoke: `node dist/cli.js scan --ci --min-score 0` exits `0`.
- Smoke: `node dist/cli.js scan --ci --min-score 101` exits non-zero with threshold failure wording.
- Smoke: `node dist/cli.js scan --ci --json --min-score 0` prints parseable JSON only.

## Risks

- Risk: false positives block CI unexpectedly.
  Mitigation: default `--ci` should report current score; threshold failure should require explicit or documented minimum behavior.
- Risk: scan failures are confused with readiness failures.
  Mitigation: separate error wording and exit-code helper.
- Risk: JSON mode is polluted by human CI text.
  Mitigation: centralize output routing and test stdout exactly.
- Risk: CI mode appears to run project validation commands.
  Mitigation: wording must say Agent Ready only detects configured commands.
