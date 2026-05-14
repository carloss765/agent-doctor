import type { InitResult } from "../generator/types.js";
import { heading, renderHeader, type PresentationOptions } from "./presentation.js";

export function formatInitResult(result: InitResult, options: PresentationOptions = {}): string {
  return [
    ...renderHeader(options),
    "",
    "Init complete.",
    "",
    `Root: ${result.root}`,
    "",
    formatFiles(
      "Created",
      result.files.filter((file) => file.status === "created").map((file) => file.path)
    ),
    formatFiles(
      "Skipped",
      result.files
        .filter((file) => file.status === "skipped")
        .map((file) => `${file.path} already exists`)
    ),
    heading("Next steps:", options),
    "  - Review AGENTS.md and adapt it to your team workflow.",
    "  - Run agent-doctor scan to confirm repository readiness."
  ].join("\n");
}

function formatFiles(title: string, files: string[]): string {
  const renderedFiles =
    files.length > 0 ? files.map((file) => `  - ${file}`) : ["  None detected."];

  return [`${title}:`, ...renderedFiles, ""].join("\n");
}
