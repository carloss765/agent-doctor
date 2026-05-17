import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { analyzeReadiness } from "../src/analyzer/analyzeReadiness.js";
import { scanRepository } from "../src/scanner/scanRepository.js";

describe("analyzeReadiness", () => {
  it("returns score 0 for an empty repository", async () => {
    const root = await createTempRepository({});

    try {
      const analysis = analyzeReadiness(await scanRepository(root));

      expect(analysis.score).toBe(0);
      expect(analysis.status).toBe("Not ready");
      expect(missingFindingLabels(analysis.findings)).toEqual([
        "README.md",
        "AGENTS.md",
        "DESIGN.md",
        ".env.example",
        "Project manifest",
        "Git repository",
        "Package manager lockfile",
        "dev script",
        "build script",
        "test script",
        "lint script",
        "format script"
      ]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("returns Needs setup for a partial repository", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "package.json": "{}",
      "pnpm-lock.yaml": ""
    });

    try {
      const analysis = analyzeReadiness(await scanRepository(root));

      expect(analysis.score).toBe(25);
      expect(analysis.status).toBe("Needs setup");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("returns Almost ready for a repository with docs and core validation scripts", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "AGENTS.md": "# Instructions",
      "package.json": JSON.stringify({
        scripts: {
          build: "tsc -p tsconfig.json",
          test: "vitest run"
        }
      }),
      "pnpm-lock.yaml": "",
      ".git/": ""
    });

    try {
      const analysis = analyzeReadiness(await scanRepository(root));

      expect(analysis.score).toBe(65);
      expect(analysis.status).toBe("Almost ready");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("returns Ready for a complete repository", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "AGENTS.md": "# Instructions",
      "DESIGN.md": "# Design",
      ".env.example": "TEST_VALUE=",
      "package.json": JSON.stringify({
        scripts: {
          dev: "tsx src/cli.ts",
          build: "tsc -p tsconfig.json",
          test: "vitest run",
          lint: "eslint .",
          format: "prettier --write ."
        }
      }),
      "pnpm-lock.yaml": "",
      ".git/": ""
    });

    try {
      const analysis = analyzeReadiness(await scanRepository(root));

      expect(analysis.score).toBe(100);
      expect(analysis.status).toBe("Ready");
      expect(analysis.nextSteps).toEqual(["This repository is ready for coding agents."]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("returns Ready with gaps when high-scoring repositories still have missing items", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "AGENTS.md": "# Instructions",
      ".env.example": "TEST_VALUE=",
      "package.json": JSON.stringify({
        scripts: {
          dev: "tsx src/cli.ts",
          build: "tsc -p tsconfig.json",
          test: "vitest run",
          lint: "eslint .",
          format: "prettier --write ."
        }
      }),
      "pnpm-lock.yaml": "",
      ".git/": ""
    });

    try {
      const analysis = analyzeReadiness(await scanRepository(root));

      expect(analysis.score).toBe(90);
      expect(analysis.status).toBe("Ready with gaps");
      expect(analysis.nextSteps).toEqual(["Run agent-ready init to generate missing base files."]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("returns deterministic analysis for the same scan result", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "AGENTS.md": "# Instructions",
      "DESIGN.md": "# Design",
      ".env.example": "TEST_VALUE=",
      "package.json": JSON.stringify({
        scripts: {
          dev: "tsx src/cli.ts",
          build: "tsc -p tsconfig.json",
          test: "vitest run",
          lint: "eslint .",
          format: "prettier --write ."
        }
      }),
      "pnpm-lock.yaml": "",
      ".git/": ""
    });

    try {
      const scan = await scanRepository(root);

      expect(analyzeReadiness(scan)).toEqual(analyzeReadiness(scan));
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("does not create files while analyzing scanner output", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "package.json": "{}",
      "pnpm-lock.yaml": ""
    });

    try {
      const before = await readdir(root);
      analyzeReadiness(await scanRepository(root));
      const after = await readdir(root);

      expect(after).toEqual(before);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

function missingFindingLabels(findings: Array<{ label: string; earned: boolean }>): string[] {
  return findings.filter((finding) => !finding.earned).map((finding) => finding.label);
}

async function createTempRepository(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "agent-ready-"));

  await Promise.all(
    Object.entries(files).map(async ([file, content]) => {
      const target = path.join(root, file);

      if (file.endsWith("/")) {
        await mkdir(target, { recursive: true });
        return;
      }

      await writeFile(target, content);
    })
  );

  return root;
}
