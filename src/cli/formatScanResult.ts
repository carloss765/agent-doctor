import { analyzeReadiness } from "../analyzer/analyzeReadiness.js";
import type { ScanResult } from "../scanner/types.js";

export function formatScanResult(result: ScanResult): string {
  const analysis = analyzeReadiness(result);
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
    "Agent readiness:",
    `  Score: ${analysis.score}/100`,
    `  Status: ${analysis.status}`,
    "",
    formatList(
      "Found",
      result.found.map((signal) => signal.label)
    ),
    formatList(
      "Missing",
      result.missing.map((signal) => signal.label)
    ),
    formatList(
      "Scripts detected",
      result.scripts.map((script) => `${script.name}: ${script.command}`)
    ),
    formatList("Missing scripts", result.missingScripts),
    "Next steps:",
    ...analysis.nextSteps.map((step) => `  - ${step}`)
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
