import { analyzeReadiness } from "../analyzer/analyzeReadiness.js";
import type { ScanResult } from "../scanner/types.js";
import {
  heading,
  label,
  missingItem,
  renderTitle,
  scoreBar,
  success,
  successItem,
  toolItem,
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
    `  ${label("Path:", options)} ${result.root}`,
    `  ${label("Git:", options)} ${result.gitDetected ? success("detected", options) : warning("not detected", options)}`,
    `  ${label("Package manager:", options)} ${result.packageManager}`,
    `  ${label("Project manifest:", options)} ${formatInlineList(result.manifests)}`,
    "",
    heading("Agent readiness:", options),
    `  ${label("Score:", options)} ${analysis.score}/100 ${scoreBar(analysis.score, options)}`,
    `  ${label("Status:", options)} ${formatStatus(analysis.status, options)}`,
    "",
    formatList(
      "Found",
      result.found.map((signal) => signal.label),
      successItem,
      options
    ),
    formatList(
      "Missing",
      result.missing.map((signal) => signal.label),
      missingItem,
      options
    ),
    formatList(
      "Scripts detected",
      result.scripts.map((script) => `${script.name}: ${script.command}`),
      successItem,
      options
    ),
    formatList("Missing scripts", result.missingScripts, missingItem, options),
    formatTools(result.agentTools, options),
    formatList(
      "Skills detected",
      result.skills
        .filter((skill) => skill.detected)
        .map((skill) => `${skill.directory}: ${skill.count}`),
      successItem,
      options
    ),
    heading("Next steps:", options),
    ...analysis.nextSteps.map((step) => `  - ${step}`)
  ];

  return lines.join("\n");
}

function formatList(
  title: string,
  items: string[],
  formatItem: (item: string, options: PresentationOptions) => string,
  options: PresentationOptions
): string {
  const renderedItems =
    items.length > 0 ? items.map((item) => formatItem(item, options)) : ["  None detected."];

  return [`${title}:`, ...renderedItems, ""].join("\n");
}

function formatInlineList(items: string[]): string {
  return items.length > 0 ? items.join(", ") : "not detected";
}

function formatTools(
  tools: Array<{ name: string; detected: boolean; files: string[] }>,
  options: PresentationOptions
): string {
  const renderedTools =
    tools.length > 0
      ? tools.map((tool) => toolItem(tool.name, tool.files.join(", "), tool.detected, options))
      : ["  None detected."];

  return ["Tool use:", ...renderedTools, ""].join("\n");
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
