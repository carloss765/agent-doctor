# Agent Doctor Project Agents

This folder contains role definitions for specialized agents working on Agent Doctor.

Agent Doctor is a local-first TypeScript CLI. It scans repositories, reports agent-readiness gaps, generates safe setup files, and writes prescriptions for external coding agents. These roles should keep that product boundary intact.

Use these files when assigning project work:

- [Project Manager](project-manager.md): scopes milestones, acceptance criteria, and release risk.
- [Product Designer](product-designer.md): owns CLI experience, generated copy, report structure, and landing-page UX.
- [Developer](developer.md): implements scanner, analyzer, generator, prescription, and CLI changes.
- [DevOps Engineer](devops-engineer.md): owns package scripts, CI, npm publishing readiness, and operational safety.
- [QA](qa.md): validates CLI behavior, generated files, scoring, and regression coverage.

## Collaboration Workflow

Use [Development Orchestration](../workflows/development-orchestration.md) to coordinate subagent work.

Start each implementation increment from a written brief:

- [Work Brief Template](../messages/work-brief-template.md)
- [Subagent Handoff Template](../messages/handoff-template.md)

## Shared Project Context

- Runtime and language: Node.js 20+, TypeScript, ESM.
- Package manager: pnpm.
- CLI framework: Commander.
- Test runner: Vitest.
- Core commands: `scan`, `init`, `prescribe`, plus aliases where implemented.
- Core source areas: `src/scanner`, `src/analyzer`, `src/generator`, `src/cli`, and `src/cli.ts`.
- Validation commands: `pnpm lint`, `pnpm test`, `pnpm build`, or `pnpm check`.

## Shared Rules

- Read `AGENTS.md`, `README.md`, `docs/requirements.md`, and `docs/technical-decisions.md` before scoped work.
- Keep `scan` read-only.
- Do not add AI provider SDKs, hosted services, account requirements, or API-key flows for the MVP.
- Do not overwrite user files unless the command behavior explicitly asks for approval or uses the existing safe write path.
- Keep generated output deterministic and easy to test.
- Prefer existing project patterns over new abstractions.
- Document assumptions, risks, changed files, and verification steps in the final handoff.
