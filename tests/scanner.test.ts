import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { scanRepository } from "../src/scanner/scanRepository.js";

describe("scanRepository", () => {
  it("detects a partial Node repository", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "package.json": "{}",
      "pnpm-lock.yaml": "",
      ".git/": ""
    });

    try {
      const result = await scanRepository(root);

      expect(result.packageManager).toBe("pnpm");
      expect(result.packageManagerLockfile).toBe("pnpm-lock.yaml");
      expect(result.gitDetected).toBe(true);
      expect(result.manifests).toEqual(["package.json"]);
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
      "package.json": "{}",
      "package-lock.json": "",
      ".git/": ""
    });

    try {
      const result = await scanRepository(root);

      expect(result.packageManager).toBe("npm");
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
