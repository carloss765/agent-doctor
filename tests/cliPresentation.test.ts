import { describe, expect, it } from "vitest";

import { formatCommandList } from "../src/cli/formatCommandList.js";
import { formatInitResult } from "../src/cli/formatInitResult.js";
import { formatScanResult } from "../src/cli/formatScanResult.js";
import { renderHeader, scoreBar, withProgress } from "../src/cli/presentation.js";
import type { ScanResult } from "../src/scanner/types.js";

describe("CLI presentation", () => {
  it("renders the root command directory without running a scan", () => {
    const output = formatCommandList({ color: false, terminalColumns: 50 });

    expect(output).toContain("AGENT READY");
    expect(output).toContain(
      "Agent Ready is a local-first CLI. It does not run an AI model or upload your code."
    );
    expect(output).toContain("Usage:\n  agent-ready <command> [options]");
    expect(output).toContain("Commands:");
    expect(output).toContain("scan        Scan the repository without modifying files.");
    expect(output).toContain(
      "init        Generate missing starter files without overwriting existing files."
    );
    expect(output).toContain(
      "prescribe  Generate a prescription prompt for the coding agent you already use."
    );
    expect(output).toContain("Recommended workflow:\n  1. agent-ready scan\n  2. agent-ready init");
    expect(output).toContain("Command options:");
    expect(output).toContain("-r, --root <path>  Repository root for scan, init, or prescribe.");
  });

  it("renders score bars without color by default", () => {
    expect(scoreBar(0)).toBe("░░░░░░░░░░");
    expect(scoreBar(50)).toBe("█████░░░░░");
    expect(scoreBar(100)).toBe("██████████");
  });

  it("writes one progress line for non-interactive streams", async () => {
    const stream = createStream(false);

    const result = await withProgress("Scanning repository...", async () => "done", {
      stream,
      color: false
    });

    expect(result).toBe("done");
    expect(stream.output).toEqual([".. Scanning repository...\n"]);
  });

  it("clears animated progress before writing the final TTY line", async () => {
    const stream = createStream(true);

    await withProgress("Scanning repository...", async () => undefined, {
      stream,
      color: false
    });

    expect(stream.output.at(-1)).toBe("\u001b[2K\r✓ Scanning repository...\n");
  });

  it("shows detected and missing agent tools in scan output", () => {
    const output = formatScanResult(createScanResult(), { color: false });

    expect(output).toContain("/\\  __ \\");
    expect(output).toContain("Score: 40/100 ████░░░░░░");
    expect(output).toContain("Tool use:");
    expect(output).toContain("Codex: ready AGENTS.md");
    expect(output).toContain("Cursor: missing");
  });

  it("shows DESIGN.md created and skipped states in init output", () => {
    const output = formatInitResult(
      {
        root: "/tmp/example",
        files: [
          { path: "AGENTS.md", status: "created" },
          { path: "DESIGN.md", status: "created" },
          { path: ".env.example", status: "skipped" }
        ]
      },
      { color: false }
    );

    expect(output).toContain("Created:\n  ✓ AGENTS.md\n  ✓ DESIGN.md");
    expect(output).toContain("Skipped:\n  - .env.example already exists");
    expect(output).toContain(
      "Review DESIGN.md and complete the product, UX, copy, accessibility, and edge-state notes."
    );
  });

  it("shows DESIGN.md missing state in scan output", () => {
    const output = formatScanResult(createScanResult(), { color: false });

    expect(output).toContain("Missing:\n  - AGENTS.md\n  - DESIGN.md\n  - .env.example");
  });

  it("uses a compact header when the terminal is too narrow for ASCII art", () => {
    const header = renderHeader({ color: false, terminalColumns: 50 });

    expect(header).toEqual(["AGENT READY", "Repository readiness for coding agents."]);
    expect(header.every((line) => line.length <= 50)).toBe(true);
  });

  it("shortens the header subtitle for very narrow terminals", () => {
    const header = renderHeader({ color: false, terminalColumns: 30 });

    expect(header).toEqual(["AGENT READY", "Repo readiness for agents."]);
    expect(header.every((line) => line.length <= 30)).toBe(true);
  });
});

function createStream(isTTY: boolean): NodeJS.WriteStream & { output: string[] } {
  const output: string[] = [];

  return {
    isTTY,
    output,
    write(chunk: string) {
      output.push(chunk);
      return true;
    }
  } as NodeJS.WriteStream & { output: string[] };
}

function createScanResult(): ScanResult {
  return {
    root: "/tmp/example",
    packageManager: "pnpm",
    packageManagerLockfile: "pnpm-lock.yaml",
    gitDetected: true,
    manifests: ["package.json"],
    scripts: [{ name: "build", command: "tsc -p tsconfig.json" }],
    missingScripts: ["dev", "test", "lint", "format"],
    agentTools: [
      { name: "Codex", detected: true, files: ["AGENTS.md"] },
      { name: "Cursor", detected: false, files: [] }
    ],
    skills: [],
    found: [
      { label: "README.md", found: true },
      { label: "package.json", found: true },
      { label: "Git repository", found: true },
      { label: "Package manager lockfile: pnpm-lock.yaml", found: true }
    ],
    missing: [
      { label: "AGENTS.md", found: false },
      { label: "DESIGN.md", found: false },
      { label: ".env.example", found: false }
    ]
  };
}
