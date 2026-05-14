import type { InitResult } from "../generator/types.js";

export function formatInitResult(result: InitResult): string {
  return [
    "Agent Doctor",
    "",
    "Init complete.",
    "",
    `Root: ${result.root}`,
    "",
    formatFiles("Created", result.files.filter((file) => file.status === "created").map((file) => file.path)),
    formatFiles("Skipped", result.files.filter((file) => file.status === "skipped").map((file) => file.path)),
    "Next steps:",
    "  - Review generated files before committing them.",
    "  - Run agent-doctor scan to confirm repository readiness."
  ].join("\n");
}

function formatFiles(title: string, files: string[]): string {
  const renderedFiles =
    files.length > 0 ? files.map((file) => `  - ${file}`) : ["  None detected."];

  return [`${title}:`, ...renderedFiles, ""].join("\n");
}
