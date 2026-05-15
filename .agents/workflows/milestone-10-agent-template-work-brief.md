# Milestone 10: Agent Instruction Template

## Goal

Improve generated agent guidance without requiring an AI provider, API key, or network access.

## Scope

- Make `init` generate a more useful `AGENTS.md` from local scan context.
- Include a clear refinement prompt for the user's coding agent.
- Update `prescribe` so it explicitly asks the external agent to refine `AGENTS.md`.
- Keep generation deterministic and non-destructive.

## Validation

- Run focused generator tests.
- Run the full test suite if the focused tests pass.
