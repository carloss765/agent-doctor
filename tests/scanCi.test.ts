import { describe, expect, it } from "vitest";

import {
  evaluateScanCiResult,
  formatScanCiResult,
  parseMinimumScoreOption
} from "../src/cli/formatScanCiResult.js";
import type { ScanResult } from "../src/scanner/types.js";

describe("scan CI mode", () => {
  it("passes without a configured minimum score", () => {
    const evaluation = evaluateScanCiResult(createScanResult());

    expect(evaluation).toEqual({
      passed: true,
      exitCode: 0,
      minimumScore: null,
      reason: "No minimum score was configured."
    });
  });

  it("passes when the score meets the configured minimum", () => {
    const evaluation = evaluateScanCiResult(createScanResult(), { minimumScore: 40 });

    expect(evaluation).toEqual({
      passed: true,
      exitCode: 0,
      minimumScore: 40,
      reason: "Score 40 meets the required minimum 40."
    });
  });

  it("fails with exit code 2 when the score is below the configured minimum", () => {
    const evaluation = evaluateScanCiResult(createScanResult(), { minimumScore: 80 });

    expect(evaluation).toEqual({
      passed: false,
      exitCode: 2,
      minimumScore: 80,
      reason: "Score 40 is below the required minimum 80."
    });
  });

  it("formats compact human CI output", () => {
    const output = formatScanCiResult(createScanResult(), { minimumScore: 80 });

    expect(output).toContain("Agent Ready CI scan");
    expect(output).toContain("Score: 40/100");
    expect(output).toContain("Required minimum: 80");
    expect(output).toContain("Result: fail");
    expect(output).toContain("No files were modified.");
    expect(output).toContain("Next steps:");
  });

  it("parses and validates minimum score values", () => {
    expect(parseMinimumScoreOption(undefined)).toBeNull();
    expect(parseMinimumScoreOption("0")).toBe(0);
    expect(parseMinimumScoreOption("100")).toBe(100);
    expect(() => parseMinimumScoreOption("101")).toThrow(
      "Invalid --min-score value: 101. Expected an integer from 0 to 100."
    );
    expect(() => parseMinimumScoreOption("80.5")).toThrow(
      "Invalid --min-score value: 80.5. Expected an integer from 0 to 100."
    );
  });
});

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
