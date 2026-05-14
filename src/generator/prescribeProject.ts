import { analyzeReadiness } from "../analyzer/analyzeReadiness.js";
import type { ScanResult } from "../scanner/types.js";
import type { PrescribeResult } from "./types.js";
import { writeIfMissing } from "./writeIfMissing.js";

export async function prescribeProject(scan: ScanResult): Promise<PrescribeResult> {
  const file = await writeIfMissing(scan.root, {
    relativePath: ".agent-ready/prescription.md",
    content: renderPrescriptionMd(scan)
  });

  return {
    root: scan.root,
    files: [file]
  };
}

function renderPrescriptionMd(scan: ScanResult): string {
  const analysis = analyzeReadiness(scan);

  return `# Agent Ready Prescription

You are working inside this repository.

## Read First

- \`README.md\`
- \`AGENTS.md\` if it exists
- \`package.json\` if it exists

## Repository

- Git: ${scan.gitDetected ? "detected" : "not detected"}
- Package manager: ${scan.packageManager}
- Project manifest: ${scan.manifests.length > 0 ? scan.manifests.join(", ") : "not detected"}

## Agent Readiness

- Score: ${analysis.score}/100
- Status: ${analysis.status}

## Found

${renderList(scan.found.map((signal) => signal.label))}

## Missing Files

${renderList(scan.missing.map((signal) => signal.label))}

## Scripts Detected

${renderList(scan.scripts.map((script) => `${script.name}: ${script.command}`))}

## Missing Scripts

${renderList(scan.missingScripts)}

## Agent Tools Detected

${renderList(scan.agentTools.filter((tool) => tool.detected).map((tool) => `${tool.name}: ${tool.files.join(", ")}`))}

## Skills Detected

${renderList(scan.skills.filter((skill) => skill.detected).map((skill) => `${skill.directory}: ${skill.count}`))}

## Recommended Next Steps

${renderList(analysis.nextSteps)}

## Safety Rules

- Do not modify secrets, credentials, tokens, private keys, or local environment files.
- Do not run destructive commands without explicit approval.
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
