import { renderHeader, type PresentationOptions } from "./presentation.js";

export function formatCommandList(options: PresentationOptions = {}): string {
  return [
    ...renderHeader(options),
    "",
    "Agent Ready is a local-first CLI. It does not run an AI model or upload your code.",
    "Use it to prepare a repository for the coding agent you already use.",
    "",
    "Usage:",
    "  agent-ready <command> [options]",
    "",
    "Commands:",
    "  scan        Scan the repository without modifying files.",
    "  init        Generate missing starter files without overwriting existing files.",
    "  prescribe  Generate a prescription prompt for the coding agent you already use.",
    "",
    "Recommended workflow:",
    "  1. agent-ready scan",
    "  2. agent-ready init",
    "  3. agent-ready prescribe",
    "  4. agent-ready scan",
    "",
    "Command options:",
    "  -r, --root <path>  Repository root for scan, init, or prescribe.",
    "  --ci              Run scan in non-interactive CI mode.",
    "  --json            Print stable JSON for scan.",
    "  --min-score <n>   Fail CI mode when readiness score is below n.",
    "  -h, --help         Display help.",
    "  -V, --version      Display version."
  ].join("\n");
}
