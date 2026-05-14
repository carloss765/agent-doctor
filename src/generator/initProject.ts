import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ScanResult } from "../scanner/types.js";
import type { GeneratedFile, InitResult } from "./types.js";

type PlannedFile = {
  relativePath: string;
  content: string;
};

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
      relativePath: ".env.example",
      content: renderEnvExample()
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

function renderEnvExample(): string {
  return `# Agent Doctor does not require environment variables for the MVP.
#
# Add future optional configuration values here using safe placeholders.
# Never commit real secrets, tokens, API keys, or credentials.
`;
}

function formatCommand(scan: ScanResult, scriptName: string): string {
  return scan.scripts.find((script) => script.name === scriptName)?.command ?? "not detected";
}
