import type { ScanResult } from "../scanner/types.js";
import type { GeneratedFile, InitResult } from "./types.js";
import { writeIfMissing, type PlannedFile } from "./writeIfMissing.js";

export async function initProject(scan: ScanResult): Promise<InitResult> {
  const plannedFiles = createPlannedFiles(scan);
  const files: GeneratedFile[] = [];

  for (const plannedFile of plannedFiles) {
    files.push(await writeIfMissing(scan.root, plannedFile));
  }

  return {
    root: scan.root,
    files
  };
}

function createPlannedFiles(scan: ScanResult): PlannedFile[] {
  return [
    {
      relativePath: "AGENTS.md",
      content: renderAgentsMd(scan)
    },
    {
      relativePath: "DESIGN.md",
      content: renderDesignMd(scan)
    },
    {
      relativePath: ".env.example",
      content: renderEnvExample()
    }
  ];
}

function renderAgentsMd(scan: ScanResult): string {
  return `# AGENTS.md

## Project Overview

This file is a local Agent Ready starter. It was generated from repository signals only, without
sending project contents to an AI model.

Refine this overview after reading the project documentation and source code. Describe what the
project does, who uses it, and the parts of the codebase that matter most for day-to-day changes.

## Local Context

- Repository root: ${scan.root}
- Git repository: ${scan.gitDetected ? "detected" : "not detected"}
- Package manager: ${scan.packageManager}
- Project manifests: ${formatList(scan.manifests)}
- Agent tools detected: ${formatDetectedAgentTools(scan)}
- Local skills detected: ${formatDetectedSkills(scan)}

## Commands

- Dev: ${formatCommand(scan, "dev")}
- Build: ${formatCommand(scan, "build")}
- Test: ${formatCommand(scan, "test")}
- Lint: ${formatCommand(scan, "lint")}
- Format: ${formatCommand(scan, "format")}

## Agent Refinement Prompt

Use this section as the first task for the coding agent that will work in this repository.

1. Read \`README.md\`, \`package.json\`, existing docs, and the main source folders.
2. Replace the generic project overview with a short, accurate project-specific summary.
3. Document the real development commands. Do not invent commands that are not present.
4. Add repository-specific notes about architecture, generated files, test strategy, and risky areas.
5. Preserve the safety rules below.
6. Keep this file concise and useful for future coding agents.

## Agent Rules

- Do not edit secrets, credentials, tokens, private keys, or local environment files.
- Do not run destructive commands without explicit approval.
- Prefer small, reviewable changes.
- Follow existing project patterns before adding new abstractions.
- Run available validation commands after making changes.
- Summarize changed files and validation results in the final handoff.
`;
}

function renderDesignMd(scan: ScanResult): string {
  return `# DESIGN.md

## Purpose

This file is a local Agent Ready starter for product and UX context. It was generated from repository
signals only, without sending project contents to an AI model.

Use it to document how the product should feel, what users need, and which interface decisions matter
before asking a coding agent to change UI, copy, flows, or design systems.

## Repository Signals

- Repository root: ${scan.root}
- Project manifests: ${formatList(scan.manifests)}
- Package manager: ${scan.packageManager}
- Existing agent instructions: ${hasFoundSignal(scan, "AGENTS.md") ? "AGENTS.md detected" : "not detected"}

## Design Brief

Replace this starter section with concise, project-specific design context:

- Product: what this project helps users do.
- Primary users: who uses it and what they are trying to accomplish.
- Core flows: the main paths users take through the product.
- UX principles: the product qualities to preserve, such as speed, clarity, safety, or trust.
- UX decisions: important design choices already made and why they matter.
- Constraints and non-goals: what the agent should avoid changing without approval.
- Voice and tone: how interface copy should sound.
- Visual system: layout, spacing, color, typography, icon, and component conventions.
- Accessibility: keyboard, focus, contrast, motion, labels, and screen reader expectations.
- Edge states: empty, loading, error, offline, permission, partial data, and success states.
- Open questions: product or design gaps that need owner input instead of agent guesses.

## Agent Design Prompt

Give this prompt to the coding agent you already use after it has read the repository:

\`\`\`text
Read README.md, AGENTS.md if present, package.json if present, existing docs, and the main UI/source
folders. Then complete DESIGN.md for this repository.

Do not invent product facts. If a product detail is not visible in the repository, write "not documented"
and list the question for the project owner.

Document the product purpose, primary users, core flows, UX principles, voice and tone, visual system,
accessibility expectations, and important edge states. Keep the result concise and practical for future
UI, copy, and product changes.

Do not change application code unless explicitly asked. Do not modify secrets or local environment files.
\`\`\`

## Accessibility And Readability Notes

- Prefer plain language and short sections.
- Keep headings scannable and deterministic so future changes are easy to review.
- Include keyboard and focus behavior for interactive UI.
- Include labels, helper text, and error copy for forms.
- Call out contrast, reduced-motion, and screen reader requirements when the product has UI.
`;
}

function renderEnvExample(): string {
  return `# Agent Ready does not require environment variables for the MVP.
#
# Add future optional configuration values here using safe placeholders.
# Never commit real secrets, tokens, API keys, or credentials.
`;
}

function formatCommand(scan: ScanResult, scriptName: string): string {
  return scan.scripts.find((script) => script.name === scriptName)?.command ?? "not detected";
}

function formatList(items: readonly string[]): string {
  return items.length > 0 ? items.join(", ") : "not detected";
}

function hasFoundSignal(scan: ScanResult, label: string): boolean {
  return scan.found.some((signal) => signal.label === label);
}

function formatDetectedAgentTools(scan: ScanResult): string {
  const detectedTools = scan.agentTools
    .filter((tool) => tool.detected)
    .map((tool) => `${tool.name} (${tool.files.join(", ")})`);

  return formatList(detectedTools);
}

function formatDetectedSkills(scan: ScanResult): string {
  const detectedSkills = scan.skills
    .filter((skill) => skill.detected)
    .map((skill) => `${skill.directory} (${skill.count})`);

  return formatList(detectedSkills);
}
