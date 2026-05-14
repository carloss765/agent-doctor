import type { PrescribeResult } from "../generator/types.js";
import { heading, renderTitle, type PresentationOptions } from "./presentation.js";

export function formatPrescribeResult(
  result: PrescribeResult,
  options: PresentationOptions = {}
): string {
  return [
    renderTitle(options),
    "",
    "Prescription complete.",
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
    "  - Give .agent-doctor/prescription.md to your coding agent.",
    "  - Review the prescription before asking an agent to change code."
  ].join("\n");
}

function formatFiles(title: string, files: string[]): string {
  const renderedFiles =
    files.length > 0 ? files.map((file) => `  - ${file}`) : ["  None detected."];

  return [`${title}:`, ...renderedFiles, ""].join("\n");
}
