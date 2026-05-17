import { describe, expect, it } from "vitest";

import {
  createScanReport,
  formatScanReportJson,
  type ReportJsonV1
} from "../src/reporter/formatScanReportJson.js";
import type { ScanResult } from "../src/scanner/types.js";

describe("scan JSON report", () => {
  it("creates a stable versioned report from scanner and analyzer output", () => {
    const report = createScanReport(createScanResult(), { toolVersion: "0.1.0" });

    expect(report).toEqual({
      schemaVersion: "1.0",
      toolVersion: "0.1.0",
      root: "/tmp/example",
      summary: {
        score: 40,
        status: "Needs setup"
      },
      repository: {
        git: {
          status: "detected",
          detected: true,
          evidence: [".git"]
        },
        packageManager: {
          status: "detected",
          name: "pnpm",
          lockfile: "pnpm-lock.yaml",
          evidence: ["pnpm-lock.yaml"]
        },
        manifests: ["package.json"]
      },
      signals: [
        { label: "README.md", status: "detected" },
        { label: "package.json", status: "detected" },
        { label: "Git repository", status: "detected" },
        { label: "Package manager lockfile: pnpm-lock.yaml", status: "detected" },
        { label: "AGENTS.md", status: "missing" },
        { label: "DESIGN.md", status: "missing" },
        { label: ".env.example", status: "missing" }
      ],
      commands: [
        { name: "dev", status: "missing", command: null, source: null },
        {
          name: "build",
          status: "detected",
          command: "tsc -p tsconfig.json",
          source: "package.json"
        },
        { name: "test", status: "missing", command: null, source: null },
        { name: "lint", status: "missing", command: null, source: null },
        { name: "format", status: "missing", command: null, source: null }
      ],
      agentTools: [
        {
          name: "Codex",
          status: "detected",
          detected: true,
          evidence: ["AGENTS.md"]
        },
        {
          name: "Cursor",
          status: "missing",
          detected: false,
          evidence: []
        }
      ],
      skills: [],
      findings: [
        { label: "README.md", points: 10, earned: true, status: "detected" },
        { label: "AGENTS.md", points: 15, earned: false, status: "missing" },
        { label: "DESIGN.md", points: 10, earned: false, status: "missing" },
        { label: ".env.example", points: 10, earned: false, status: "missing" },
        { label: "Project manifest", points: 10, earned: true, status: "detected" },
        { label: "Git repository", points: 5, earned: true, status: "detected" },
        { label: "Package manager lockfile", points: 5, earned: true, status: "detected" },
        { label: "dev script", points: 5, earned: false, status: "missing" },
        { label: "build script", points: 10, earned: true, status: "detected" },
        { label: "test script", points: 10, earned: false, status: "missing" },
        { label: "lint script", points: 5, earned: false, status: "missing" },
        { label: "format script", points: 5, earned: false, status: "missing" }
      ],
      recommendations: [
        "Run agent-ready init to generate missing base files.",
        "Add missing validation scripts before delegating work to coding agents."
      ]
    } satisfies ReportJsonV1);
  });

  it("formats parseable deterministic JSON without variable fields", () => {
    const scan = createScanResult();
    const first = formatScanReportJson(scan, { toolVersion: "0.1.0" });
    const second = formatScanReportJson(scan, { toolVersion: "0.1.0" });

    expect(first).toBe(second);
    expect(JSON.parse(first)).toEqual(createScanReport(scan, { toolVersion: "0.1.0" }));
    expect(first).not.toContain("generatedAt");
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
