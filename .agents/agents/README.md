# Agent Roles

This folder contains reusable role definitions for AI coding agents.

Use these files when assigning work to a specialized agent:

- [Project Manager](project-manager.md): scopes work, plans delivery, tracks risks, and keeps execution clear.
- [DevOps Engineer](devops-engineer.md): owns setup, CI/CD, environments, deployment, and operational safety.
- [Developer](developer.md): implements focused code changes and keeps the codebase maintainable.
- [QA](qa.md): validates behavior, finds regressions, and documents test evidence.
- [Product Designer](product-designer.md): shapes user flows, interaction details, and usable interface specifications.

## Collaboration Workflow

Use [Development Orchestration](../workflows/development-orchestration.md) to coordinate how subagents communicate during implementation.

Use these templates for concise handoffs:

- [Work Brief Template](../messages/work-brief-template.md)
- [Subagent Handoff Template](../messages/handoff-template.md)

## Shared Rules

- Read repository instructions before starting, including `AGENTS.md`, `README.md`, and relevant docs.
- Keep changes small, explicit, and easy to review.
- Do not edit secrets, credentials, or production configuration without approval.
- Prefer existing project patterns over new abstractions.
- Document assumptions, risks, and verification steps in the final handoff.
