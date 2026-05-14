import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { analyzeReadiness } from "../analyzer/analyzeReadiness.js";
import type { ReadinessAnalysis } from "../analyzer/types.js";
import type { ScanResult } from "../scanner/types.js";
import type { GeneratedFile, InitResult } from "./types.js";

type PlannedFile = {
  relativePath: string;
  content: string;
};

export async function initProject(scan: ScanResult): Promise<InitResult> {
  const analysis = analyzeReadiness(scan);
  const plannedFiles = createPlannedFiles(scan, analysis);
  const files: GeneratedFile[] = [];

  for (const plannedFile of plannedFiles) {
    files.push(await writeIfMissing(scan.root, plannedFile));
  }

  return {
    root: scan.root,
    files
  };
}

function createPlannedFiles(scan: ScanResult, analysis: ReadinessAnalysis): PlannedFile[] {
  return [
    {
      relativePath: "AGENTS.md",
      content: renderAgentsMd(scan)
    },
    {
      relativePath: ".agent-doctor/report.md",
      content: renderReportMd(scan, analysis)
    },
    {
      relativePath: ".agent-doctor/report.json",
      content: `${JSON.stringify({ scan, analysis }, null, 2)}\n`
    },
    {
      relativePath: ".agent-doctor/context.md",
      content: renderContextMd(scan)
    },
    {
      relativePath: ".agent-doctor/prescription.md",
      content: renderPrescriptionMd(scan, analysis)
    }
  ];
}

async function writeIfMissing(root: string, plannedFile: PlannedFile): Promise<GeneratedFile> {
  const targetPath = path.join(root, plannedFile.relativePath);

  if (await exists(targetPath)) {
    return {
      path: plannedFile.relativePath,
      status: "skipped"
    };
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, plannedFile.content, "utf8");

  return {
    path: plannedFile.relativePath,
    status: "created"
  };
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function renderAgentsMd(scan: ScanResult): string {
  return `# AGENTS.md

## Project Overview

This repository was initialized with Agent Doctor.

## Commands

- Dev: ${formatCommand(scan, "dev")}
- Build: ${formatCommand(scan, "build")}
- Test: ${formatCommand(scan, "test")}
- Lint: ${formatCommand(scan, "lint")}
- Format: ${formatCommand(scan, "format")}

## Agent Rules

- Do not edit secrets, credentials, tokens, private keys, or local environment files.
- Do not run destructive commands without explicit approval.
- Prefer small, reviewable changes.
- Follow existing project patterns before adding new abstractions.
- Run available validation commands after making changes.
- Summarize changed files and validation results in the final handoff.
`;
}

function renderReportMd(scan: ScanResult, analysis: ReadinessAnalysis): string {
  return `# Agent Doctor Report

## Repository

- Path: ${scan.root}
- Git: ${scan.gitDetected ? "detected" : "not detected"}
- Package manager: ${scan.packageManager}
- Project manifest: ${scan.manifests.length > 0 ? scan.manifests.join(", ") : "not detected"}

## Agent Readiness

- Score: ${analysis.score}/100
- Status: ${analysis.status}

## Found

${renderList(scan.found.map((signal) => signal.label))}

## Missing

${renderList(scan.missing.map((signal) => signal.label))}

## Scripts Detected

${renderList(scan.scripts.map((script) => `${script.name}: ${script.command}`))}

## Missing Scripts

${renderList(scan.missingScripts)}

## Next Steps

${renderList(analysis.nextSteps)}
`;
}

function renderContextMd(scan: ScanResult): string {
  return `# Repository Context

## Summary

Agent Doctor detected this repository as a local project with these signals:

- Git: ${scan.gitDetected ? "detected" : "not detected"}
- Package manager: ${scan.packageManager}
- Manifests: ${scan.manifests.length > 0 ? scan.manifests.join(", ") : "not detected"}

## Notes For Coding Agents

- Read \`README.md\` and \`AGENTS.md\` before changing code.
- Use detected scripts when validating changes.
- If a command is missing, do not invent it. Ask or add it intentionally.
`;
}

function renderPrescriptionMd(scan: ScanResult, analysis: ReadinessAnalysis): string {
  return `# Agent Doctor Prescription

You are working inside this repository.

Read these files first:

- \`README.md\`
- \`AGENTS.md\`
- \`.agent-doctor/report.md\`
- \`.agent-doctor/context.md\`

## Current Readiness

- Score: ${analysis.score}/100
- Status: ${analysis.status}

## Recommended Work

${renderList(analysis.nextSteps)}

## Safety Rules

- Do not modify secrets or credential files.
- Do not run destructive commands without approval.
- Do not change business logic unless explicitly requested.
- Prefer small, focused changes.
- Run available validation commands before the final handoff.
`;
}

function renderList(items: string[]): string {
  if (items.length === 0) {
    return "- None detected.";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function formatCommand(scan: ScanResult, scriptName: string): string {
  return scan.scripts.find((script) => script.name === scriptName)?.command ?? "not detected";
}
