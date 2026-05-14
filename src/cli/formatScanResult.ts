import type { ScanResult } from "../scanner/types.js";

export function formatScanResult(result: ScanResult): string {
  const lines = [
    "Agent Doctor",
    "",
    "Scan complete. No files were modified.",
    "",
    "Repository:",
    `  Path: ${result.root}`,
    `  Git: ${result.gitDetected ? "detected" : "not detected"}`,
    `  Package manager: ${result.packageManager}`,
    `  Project manifest: ${formatInlineList(result.manifests)}`,
    "",
    formatList(
      "Found",
      result.found.map((signal) => signal.label)
    ),
    formatList(
      "Missing",
      result.missing.map((signal) => signal.label)
    ),
    "Next steps:",
    ...formatNextSteps(result)
  ];

  return lines.join("\n");
}

function formatList(title: string, items: string[]): string {
  const renderedItems =
    items.length > 0 ? items.map((item) => `  - ${item}`) : ["  None detected."];

  return [`${title}:`, ...renderedItems, ""].join("\n");
}

function formatInlineList(items: string[]): string {
  return items.length > 0 ? items.join(", ") : "not detected";
}

function formatNextSteps(result: ScanResult): string[] {
  if (result.missing.length === 0) {
    return ["  - This repository has the basic files needed for coding agents."];
  }

  return ["  - Run agent-doctor init to generate missing base files."];
}
