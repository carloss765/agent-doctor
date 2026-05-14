import type { PrescribeResult } from "../generator/types.js";
import {
  heading,
  renderTitle,
  skippedItem,
  successItem,
  type PresentationOptions
} from "./presentation.js";

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
      result.files.filter((file) => file.status === "created").map((file) => file.path),
      successItem,
      options
    ),
    formatFiles(
      "Skipped",
      result.files
        .filter((file) => file.status === "skipped")
        .map((file) => `${file.path} already exists`),
      skippedItem,
      options
    ),
    heading("Next steps:", options),
    "  - Give .agent-doctor/prescription.md to your coding agent.",
    "  - Review the prescription before asking an agent to change code."
  ].join("\n");
}

function formatFiles(
  title: string,
  files: string[],
  formatFile: (file: string, options: PresentationOptions) => string,
  options: PresentationOptions
): string {
  const renderedFiles =
    files.length > 0 ? files.map((file) => formatFile(file, options)) : ["  None detected."];

  return [`${title}:`, ...renderedFiles, ""].join("\n");
}
