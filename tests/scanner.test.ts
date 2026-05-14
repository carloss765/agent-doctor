import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { scanRepository } from "../src/scanner/scanRepository.js";

describe("scanRepository", () => {
  it("detects a partial Node repository", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "package.json": JSON.stringify({
        scripts: {
          dev: "vite",
          build: "tsc -p tsconfig.json"
        }
      }),
      "pnpm-lock.yaml": "",
      ".git/": ""
    });

    try {
      const result = await scanRepository(root);

      expect(result.packageManager).toBe("pnpm");
      expect(result.packageManagerLockfile).toBe("pnpm-lock.yaml");
      expect(result.gitDetected).toBe(true);
      expect(result.manifests).toEqual(["package.json"]);
      expect(result.scripts).toEqual([
        { name: "dev", command: "vite" },
        { name: "build", command: "tsc -p tsconfig.json" }
      ]);
      expect(result.missingScripts).toEqual(["test", "lint", "format"]);
      expect(labels(result.found)).toEqual([
        "README.md",
        "package.json",
        "Git repository",
        "Package manager lockfile: pnpm-lock.yaml"
      ]);
      expect(labels(result.missing)).toEqual(["AGENTS.md", ".env.example"]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("reports all base signals as missing for an empty repository", async () => {
    const root = await createTempRepository({});

    try {
      const result = await scanRepository(root);

      expect(result.packageManager).toBe("not detected");
      expect(result.packageManagerLockfile).toBeNull();
      expect(result.gitDetected).toBe(false);
      expect(result.manifests).toEqual([]);
      expect(result.scripts).toEqual([]);
      expect(result.missingScripts).toEqual(["dev", "build", "test", "lint", "format"]);
      expect(labels(result.found)).toEqual([]);
      expect(labels(result.missing)).toEqual([
        "README.md",
        "AGENTS.md",
        ".env.example",
        "package.json",
        "Git repository",
        "Package manager lockfile"
      ]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("detects all basic readiness signals", async () => {
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
      "package-lock.json": "",
      ".git/": ""
    });

    try {
      const result = await scanRepository(root);

      expect(result.packageManager).toBe("npm");
      expect(result.scripts).toEqual([
        { name: "dev", command: "tsx src/cli.ts" },
        { name: "build", command: "tsc -p tsconfig.json" },
        { name: "test", command: "vitest run" },
        { name: "lint", command: "eslint ." },
        { name: "format", command: "prettier --write ." }
      ]);
      expect(result.missingScripts).toEqual([]);
      expect(labels(result.found)).toEqual([
        "README.md",
        "AGENTS.md",
        ".env.example",
        "package.json",
        "Git repository",
        "Package manager lockfile: package-lock.json"
      ]);
      expect(result.missing).toEqual([]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("does not create files while scanning", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project"
    });

    try {
      const before = await readdir(root);
      await scanRepository(root);
      const after = await readdir(root);

      expect(after).toEqual(before);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("detects package managers from lockfiles without guessing", async () => {
    await expectPackageManager("pnpm-lock.yaml", "pnpm");
    await expectPackageManager("package-lock.json", "npm");
    await expectPackageManager("yarn.lock", "yarn");
  });

  it("ignores empty scripts instead of inventing commands", async () => {
    const root = await createTempRepository({
      "package.json": JSON.stringify({
        scripts: {
          test: "   ",
          lint: "eslint ."
        }
      })
    });

    try {
      const result = await scanRepository(root);

      expect(result.scripts).toEqual([{ name: "lint", command: "eslint ." }]);
      expect(result.missingScripts).toEqual(["dev", "build", "test", "format"]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("returns a clear error for invalid package.json", async () => {
    const root = await createTempRepository({
      "package.json": "{ invalid json"
    });

    try {
      await expect(scanRepository(root)).rejects.toThrow("Unable to parse package.json:");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

function labels(signals: Array<{ label: string }>): string[] {
  return signals.map((signal) => signal.label);
}

async function createTempRepository(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "agent-doctor-"));

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

async function expectPackageManager(lockfile: string, packageManager: string): Promise<void> {
  const root = await createTempRepository({
    "package.json": "{}",
    [lockfile]: ""
  });

  try {
    const result = await scanRepository(root);

    expect(result.packageManager).toBe(packageManager);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
