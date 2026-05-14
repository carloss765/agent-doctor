import { describe, expect, it } from "vitest";

import { formatScanResult } from "../src/cli/formatScanResult.js";
import { scoreBar, withProgress } from "../src/cli/presentation.js";
import type { ScanResult } from "../src/scanner/types.js";

describe("CLI presentation", () => {
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

    expect(output).toContain("Score: 40/100 ████░░░░░░");
    expect(output).toContain("Tool use:");
    expect(output).toContain("Codex: ready AGENTS.md");
    expect(output).toContain("Cursor: missing");
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
      { label: ".env.example", found: false }
    ]
  };
}
