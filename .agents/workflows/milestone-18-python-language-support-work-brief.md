# Milestone 18: First Non-Node Language Support

## Goal

Extend Agent Ready beyond Node.js by adding a focused first pass of Python ecosystem detection and recommendations.

## User Value

Agent Ready becomes useful for more real repositories while preserving the same local-first, deterministic scan model.

## Scope

- Add Python language signals using local files only.
- Detect Python manifests and dependency files:
  - `pyproject.toml`
  - `requirements.txt`
  - `uv.lock`
  - `poetry.lock`
  - `Pipfile`
- Detect common Python validation tool configuration when present:
  - pytest
  - ruff
  - mypy
  - black
- Represent languages and validation commands with a general model that can support Node.js and Python without breaking existing Node behavior.
- Update human scan output and JSON report output to show languages and Python evidence.
- Update prescriptions to mention Python validation commands only when detected or clearly suggested as conventional, not detected.

## Non-Goals

- Do not add broad Go, Rust, PHP, Java, or polyglot support in this milestone.
- Do not execute Python commands.
- Do not install dependencies.
- Do not parse arbitrary Python source files.
- Do not infer commands from README text alone.
- Do not remove current Node.js script detection.

## Acceptance Criteria

- Scanner detects Python from supported files and reports evidence.
- Node-only repositories keep current Node behavior.
- Python-only repositories show Python as detected and Node package manager as `not detected` when applicable.
- Mixed Node/Python repositories list both ecosystems deterministically.
- Conventional commands are never presented as detected unless evidence exists.
- Human scan output includes language information without making unsupported projects look failed.
- JSON report represents languages consistently.
- Prescriptions include Python-specific guidance when Python is detected.
- Fixture tests cover Node-only, Python-only, and mixed repositories.
- `scan` remains read-only.
- `pnpm check` and `pnpm format:check` pass.

## Owner

Primary role: Developer Agent

## Required Reviewers

- Project Manager Agent: confirm scope is Python-first, not broad polyglot support.
- Product Designer Agent: review language, partial-support, and suggested-command wording.
- QA Agent: validate fixture coverage, mixed projects, and non-execution guarantees.
- DevOps Engineer Agent: review cross-platform path and package impact if command modeling changes.

## Files Or Areas

- `src/scanner/types.ts`
- `src/scanner/scanRepository.ts`
- `src/analyzer/analyzeReadiness.ts` if language support affects score or recommendations
- `src/cli/formatScanResult.ts`
- Report formatter from Milestone 14
- `src/generator/prescribeProject.ts`
- `tests/scanner.test.ts`
- `tests/analyzer.test.ts`
- `tests/cliPresentation.test.ts`
- `tests/prescribeProject.test.ts`
- `README.md`
- `docs/requirements.md`

## Validation Plan

- `pnpm format:check`
- `pnpm check`
- Fixture test: Python project with `pyproject.toml`, `uv.lock`, pytest and ruff config.
- Fixture test: Python project with only `requirements.txt`.
- Fixture test: mixed Node/Python project.
- Smoke: `node dist/cli.js scan --root <python-fixture>` remains read-only.

## Risks

- Risk: current Node-specific `scripts` model does not scale to Python.
  Mitigation: introduce a general command model while preserving existing public Node fields until a compatible migration is planned.
- Risk: conventional Python commands are shown as detected.
  Mitigation: use separate `detected` and `suggested` wording.
- Risk: broader language support changes readiness scoring unexpectedly.
  Mitigation: keep Python support informational first unless scoring changes are explicitly reviewed.
- Risk: scanning becomes slow or invasive.
  Mitigation: use root-level and config-file checks only.
