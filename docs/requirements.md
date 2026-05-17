# Requirements

Agent Ready is a local-first CLI that checks whether a repository is ready for coding agents and
generates safe guidance files.

## Functional Requirements

### Repository Scan

- Detect `README.md`, `AGENTS.md`, `DESIGN.md`, `.env.example`, Git, project manifests, lockfiles,
  package manager, agent tool config files, and local skills.
- Detect Node.js scripts for `dev`, `build`, `test`, `lint`, and `format`.
- Report unknown values as `not detected` instead of guessing.
- Keep `scan` read-only.

### Readiness Analysis

- Produce a deterministic score from `0` to `100`.
- Separate detected and missing signals.
- Use `Ready with gaps` when a high-scoring repository still has actionable missing items.
- Provide concrete next steps.

### JSON Report

- `scan --json` must print stable JSON only to stdout.
- Include schema version, tool version, repository facts, commands, agent tools, skills, findings,
  and recommendations.
- Do not include timestamps, secret values, dependency trees, telemetry, or file contents.

### CI Mode

- `scan --ci` must run without prompts, progress indicators, color, or file writes.
- `scan --ci --min-score <n>` exits `0` when the score is at least `n`.
- It exits non-zero when the score is below the configured minimum.
- `scan --ci --json` must keep stdout machine-readable.

### Safe Generation

- `init` creates missing starter files without overwriting existing files.
- `prescribe` writes a prompt for the user's external coding agent.
- Generated files must warn against editing secrets, running destructive commands without approval,
  and changing business logic unless requested.

## Non-Functional Requirements

- No AI runtime dependency.
- No hosted backend, login, telemetry, or uploads.
- No target-project command execution during scans.
- Deterministic output for the same repository state.
- Small, testable TypeScript modules.
- No new dependencies without a clear documented reason.
