# Requirements

## Purpose

This document defines the functional and non-functional requirements for the Agent Ready MVP.

Agent Ready is a CLI that checks whether a repository is ready to be worked on by coding agents and generates safe guidance files for that repository.

## Scope

The MVP focuses on local repository diagnosis and file generation.

It does not include hosted services, AI model execution, accounts, billing, or external API integrations.

## Functional Requirements

### FR-001: Repository Scan

The CLI must scan the current repository and detect the files, configuration, and metadata needed to evaluate agent readiness.

Acceptance criteria:

- Detects whether `README.md` exists.
- Detects whether `AGENTS.md` exists.
- Detects whether `.env.example` exists.
- Detects whether Git is enabled.
- Detects common project files such as `package.json`, `pyproject.toml`, `Cargo.toml`, and similar manifests.
- Detects common package managers when lockfiles are present.

### FR-002: Script And Command Detection

The CLI must identify important development commands when they are available.

Acceptance criteria:

- Detects install command based on package manager.
- Detects `dev`, `build`, `test`, `lint`, and `format` scripts for Node.js projects.
- Reports missing validation commands clearly.
- Does not invent commands that are not present in the repository.

### FR-003: Project Type Detection

The CLI must infer basic project context from available files.

Acceptance criteria:

- Detects primary language when possible.
- Detects common frameworks when configuration or dependencies are present.
- Reports unknown values as `not detected` instead of guessing.
- Keeps detection logic explainable and testable.

### FR-004: Agent Readiness Score

The CLI must calculate and display a readiness score for the repository.

Acceptance criteria:

- Produces a score from `0` to `100`.
- Explains which missing items reduce the score.
- Separates found items from missing items.
- Keeps scoring rules deterministic.

### FR-005: Scan Command

The CLI must provide a `scan` command that diagnoses the repository without modifying files.

Acceptance criteria:

- Runs with `npx @agent-ready/cli scan`.
- Prints a readable summary to the terminal.
- Does not create, edit, or delete files.
- Exits successfully when the scan completes.

### FR-006: Init Command

The CLI must provide an `init` command that generates safe base files.

Acceptance criteria:

- Runs with `npx @agent-ready/cli init`.
- Creates missing base files using templates.
- Does not overwrite existing files without user approval.
- Can generate `AGENTS.md`.
- Can generate `.agent-ready/report.md`.
- Can generate `.agent-ready/report.json`.
- Can generate `.agent-ready/context.md`.
- Can generate `.agent-ready/prescription.md`.

### FR-007: Prescription Command

The CLI must provide a `prescribe` command that creates instructions for an external coding agent.

Acceptance criteria:

- Runs with `npx @agent-ready/cli prescribe`.
- Generates a clear prompt or prescription file.
- Lists the missing repository improvements.
- Tells the external agent which files to read first.
- Instructs the external agent not to modify business logic unless requested.

### FR-008: Agent-Specific Prescriptions

The CLI should support prescriptions for known coding agents.

Acceptance criteria:

- Supports a universal prescription.
- Supports Codex output.
- Supports Claude Code output.
- Supports OpenCode output.
- Names generated files clearly, for example `.agent-ready/prescription.codex.md`.

### FR-009: Optional Agent Setup Files

The CLI should generate optional setup files for specific coding agents when requested.

Acceptance criteria:

- Can generate `CLAUDE.md` for Claude Code.
- Can generate `.claude/commands/doctor.md` for Claude Code.
- Can generate `opencode.jsonc` for OpenCode.
- Does not generate agent-specific files unless requested by command or option.

### FR-010: Interactive Mode

The CLI should provide an interactive mode when run without arguments.

Acceptance criteria:

- Runs with `npx @agent-ready/cli`.
- Scans the repository.
- Shows detected project context.
- Shows found and missing items.
- Offers actions such as scan, init, prescribe, export report, and exit.

### FR-011: Report Export

The CLI must be able to write scan results to report files.

Acceptance criteria:

- Writes a human-readable report to `.agent-ready/report.md`.
- Writes machine-readable results to `.agent-ready/report.json`.
- Includes detected files, missing files, commands, project type, score, and recommendations.

### FR-012: Safety Rules Generation

The CLI must include safe default rules for coding agents.

Acceptance criteria:

- Warns agents not to edit `.env`, credentials, tokens, or private keys.
- Warns agents not to run destructive commands without approval.
- Warns agents to ask before changing authentication, payments, permissions, or database schema.
- Encourages small, reviewable changes.
- Encourages validation after changes.

### FR-013: Template-Based File Generation

Generated files must come from predictable templates.

Acceptance criteria:

- Templates are easy to inspect and test.
- Generated content uses repository scan data when available.
- Missing values are labeled clearly.
- Template output is deterministic for the same scan input.

### FR-014: Alias Commands

The CLI may support friendly aliases after core commands are stable.

Acceptance criteria:

- `check` may alias `scan`.
- `fix` may alias `prescribe`.
- `prompt` may alias `prescribe`.
- Aliases must not change the behavior of the base command.

## Non-Functional Requirements

### NFR-001: No AI Runtime Dependency

The MVP must not require an AI provider or model to run.

Acceptance criteria:

- No OpenAI, Anthropic, or similar API key is required.
- No model SDK is required for core MVP behavior.
- All diagnosis and generation works locally.

### NFR-002: Local-First Operation

The CLI must work against the local filesystem.

Acceptance criteria:

- Does not upload repository contents.
- Does not require a hosted backend.
- Does not require user login.
- Works offline after package installation.

### NFR-003: Safety

The CLI must avoid risky repository changes.

Acceptance criteria:

- `scan` is read-only.
- File generation does not overwrite existing files without approval.
- Secrets are never printed, copied, or written into generated files.
- Destructive commands are not executed by the CLI.

### NFR-004: Simplicity

The implementation must stay small and easy to understand.

Acceptance criteria:

- Modules have clear single responsibilities.
- New dependencies require a documented reason.
- Core logic is testable without running the full CLI.
- The MVP avoids databases, servers, queues, and background jobs.

### NFR-005: Maintainability

The codebase must be easy for contributors and coding agents to modify safely.

Acceptance criteria:

- Uses TypeScript.
- Uses meaningful names.
- Keeps files focused and reasonably short.
- Separates scanner, analyzer, generator, prescription builder, and CLI entrypoint.
- Includes tests for core behavior.

### NFR-006: Performance

The CLI should feel fast on small and medium repositories.

Acceptance criteria:

- Avoids unnecessary full-file reads.
- Skips large directories such as `node_modules`, `.git`, `dist`, and build outputs.
- Completes basic scans quickly on typical projects.
- Uses simple filesystem checks before heavier analysis.

### NFR-007: Deterministic Output

The same repository state should produce the same scan and generated files.

Acceptance criteria:

- Scoring is based on explicit rules.
- Generated reports have stable structure.
- Templates avoid random values.
- Test snapshots or structured assertions can validate output.

### NFR-008: Cross-Platform Support

The CLI should support common development environments.

Acceptance criteria:

- Works on macOS, Linux, and Windows where Node.js is supported.
- Uses cross-platform filesystem paths.
- Avoids shell-specific behavior in core logic.

### NFR-009: Clear User Experience

CLI output must be understandable without reading the source code.

Acceptance criteria:

- Uses plain language.
- Separates found items, missing items, and recommendations.
- Explains next steps after each command.
- Reports errors with actionable messages.

### NFR-010: Testability

The project must support automated validation.

Acceptance criteria:

- Core scanner logic can be tested with fixture repositories.
- Generator output can be tested without writing to the real project root.
- CLI commands have at least smoke tests.
- CI runs tests before release.

### NFR-011: Distribution

The CLI must be distributable as an npm package.

Acceptance criteria:

- Can be executed with `npx @agent-ready/cli`.
- Package metadata defines the CLI binary.
- Build output includes everything needed for runtime.
- Release process is documented before public publishing.

### NFR-012: Documentation

The project must document how to install, use, and validate the CLI.

Acceptance criteria:

- `README.md` explains the problem, commands, and expected outputs.
- Technical decisions are documented in `docs/technical-decisions.md`.
- Requirements are documented in this file.
- Generated files are explained clearly.

## Out Of Scope For MVP

- Running AI models directly.
- Connecting to OpenAI, Anthropic, or other model providers.
- User accounts or authentication.
- Cloud dashboard.
- Hosted repository analysis.
- Automatic production fixes.
- Database migrations.
- Plugin marketplace.
- Full framework-specific repair automation.

## Initial Milestones

### Milestone 1: Project Scaffold

- Create TypeScript CLI project.
- Configure pnpm, ESLint, Prettier, and Vitest.
- Add basic `scan` command.

### Milestone 2: Repository Scanner

- Detect project files.
- Detect package manager.
- Detect scripts.
- Detect Git.
- Produce structured scan result.

### Milestone 3: Analyzer And Score

- Convert scan results into findings.
- Calculate readiness score.
- Print terminal summary.

### Milestone 4: File Generation

- Generate `.agent-ready/report.md`.
- Generate `.agent-ready/report.json`.
- Generate `AGENTS.md`.
- Avoid overwriting files without approval.

### Milestone 5: Prescriptions

- Generate universal prescription.
- Add Codex, Claude Code, and OpenCode variants.
- Document usage flow.

## Open Questions

- Should the first CLI framework be Commander or CAC?
- Should the package ship as ESM only?
- Should generated templates live as files or embedded TypeScript strings?
- Should interactive mode be part of the first release or a later increment?
