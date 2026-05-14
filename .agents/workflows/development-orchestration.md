# Development Orchestration

## Purpose

This workflow defines how specialized subagents collaborate during Agent Ready development.

The goal is to keep work coordinated without creating unnecessary process. Each role owns a clear part of the delivery flow and communicates through concise handoffs.

## Roles

- Project Manager: owns scope, priorities, milestones, and blockers.
- Product Designer: owns user flows, CLI experience, content clarity, and interaction states.
- Developer: owns implementation, code structure, tests, and technical fit.
- DevOps Engineer: owns setup, CI, packaging, release flow, and operational safety.
- QA: owns validation strategy, test scenarios, regression checks, and release confidence.

## Collaboration Model

Project Manager coordinates the flow. Other subagents communicate through written handoffs.

Default order:

1. Project Manager clarifies goal, scope, and acceptance criteria.
2. Product Designer defines the user experience when the change affects CLI output, prompts, files, or workflows.
3. Developer implements the scoped change.
4. DevOps Engineer validates tooling, scripts, CI, packaging, and deployment impact.
5. QA validates behavior against requirements and reports defects or release risk.
6. Project Manager closes the loop with status, remaining decisions, and next increment.

The order can change when the task is operational, test-only, or design-only.

## Communication Rules

- Each subagent must state assumptions before acting on them.
- Each handoff must include changed files, decisions made, risks, and validation steps.
- Subagents should not overwrite another role's decision without explaining why.
- Scope changes go back to the Project Manager.
- User-facing behavior changes require Product Designer review.
- CI, release, package, or environment changes require DevOps Engineer review.
- Behavior changes require QA validation before the work is considered done.

## Decision Rules

Use this ownership model:

| Decision Type                        | Owner            | Required Review                                |
| ------------------------------------ | ---------------- | ---------------------------------------------- |
| Scope, milestone, priority           | Project Manager  | Developer, QA when scope affects delivery risk |
| CLI wording, flow, prompts           | Product Designer | Developer, QA                                  |
| Code structure and implementation    | Developer        | QA for behavior, DevOps for tooling impact     |
| CI, package, release, scripts        | DevOps Engineer  | Developer, QA                                  |
| Test coverage and release confidence | QA               | Developer                                      |
| Architecture-level changes           | Project Manager  | Developer, DevOps Engineer, QA                 |

## Escalation Triggers

Escalate to the user or team when:

- Requirements conflict.
- A change affects public CLI behavior.
- A new dependency is needed.
- Existing files would be overwritten.
- Security, secrets, authentication, payments, or production systems are involved.
- A requirement cannot be verified with available tooling.

## Development Loop

Use this loop for each feature or fix:

1. Intake: Project Manager writes the work brief.
2. UX pass: Product Designer clarifies the user-facing behavior.
3. Technical pass: Developer identifies affected modules and test strategy.
4. Operational pass: DevOps Engineer checks scripts, package, and CI impact.
5. Implementation: Developer makes the change.
6. Verification: QA runs or defines checks against acceptance criteria.
7. Handoff: Project Manager summarizes status and next steps.

## Minimal Work Brief

Every development task should start with:

- Goal.
- User value.
- Scope.
- Non-goals.
- Acceptance criteria.
- Owner.
- Required reviewers.
- Validation commands.

## Done Definition

A task is done when:

- Acceptance criteria are met.
- Relevant tests or checks passed, or failures are documented.
- User-facing text is clear.
- Generated files or CLI output are deterministic.
- Changed files are summarized.
- Remaining risks are explicit.

## Starting Development

Recommended first increment:

1. Scaffold the TypeScript CLI project.
2. Add `scan` command with read-only repository checks.
3. Add tests for scanner behavior.
4. Add basic package scripts.
5. Add CI validation.

Suggested ownership:

- Project Manager: define milestone 1 acceptance criteria.
- Developer: scaffold CLI and scanner.
- DevOps Engineer: package scripts and CI.
- QA: scanner test scenarios.
- Product Designer: terminal output wording and command flow.
