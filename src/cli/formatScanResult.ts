import { analyzeReadiness } from "../analyzer/analyzeReadiness.js";
import type { ScanResult } from "../scanner/types.js";
import {
  heading,
  renderTitle,
  success,
  warning,
  type PresentationOptions
} from "./presentation.js";

export function formatScanResult(result: ScanResult, options: PresentationOptions = {}): string {
  const analysis = analyzeReadiness(result);
  const lines = [
    renderTitle(options),
    "",
    "Scan complete. No files were modified.",
    "",
    heading("Repository:", options),
    `  Path: ${result.root}`,
    `  Git: ${result.gitDetected ? "detected" : "not detected"}`,
    `  Package manager: ${result.packageManager}`,
    `  Project manifest: ${formatInlineList(result.manifests)}`,
    "",
    heading("Agent readiness:", options),
    `  Score: ${analysis.score}/100`,
    `  Status: ${formatStatus(analysis.status, options)}`,
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
    heading("Next steps:", options),
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

function formatStatus(status: string, options: PresentationOptions): string {
  if (status === "Ready") {
    return success(status, options);
  }

  if (status === "Almost ready") {
    return warning(status, options);
  }

  return status;
}
