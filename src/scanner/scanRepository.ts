import { access, readdir } from "node:fs/promises";
import path from "node:path";

import type { PackageManager, ProjectManifest, RepositorySignal, ScanResult } from "./types.js";

const manifestFiles: ProjectManifest[] = [
  "package.json",
  "pyproject.toml",
  "Cargo.toml",
  "go.mod",
  "composer.json"
];

const requiredFiles = ["README.md", "AGENTS.md", ".env.example", "package.json"] as const;

const packageManagerFiles: Array<{ label: string; manager: PackageManager }> = [
  { label: "pnpm-lock.yaml", manager: "pnpm" },
  { label: "package-lock.json", manager: "npm" },
  { label: "yarn.lock", manager: "yarn" },
  { label: "bun.lockb", manager: "bun" },
  { label: "bun.lock", manager: "bun" }
];

export async function scanRepository(root: string = process.cwd()): Promise<ScanResult> {
  const normalizedRoot = path.resolve(root);
  const entries = new Set(await readDirectoryEntries(normalizedRoot));
  const packageManagerLockfile = detectPackageManagerLockfile(entries);
  const gitDetected = entries.has(".git");
  const signals = [
    ...requiredFiles.map((file) => createSignal(file, entries.has(file))),
    createSignal("Git repository", gitDetected),
    createSignal(
      packageManagerLockfile
        ? `Package manager lockfile: ${packageManagerLockfile}`
        : "Package manager lockfile",
      packageManagerLockfile !== null
    )
  ];

  return {
    root: normalizedRoot,
    packageManager: detectPackageManager(packageManagerLockfile),
    packageManagerLockfile,
    gitDetected,
    manifests: manifestFiles.filter((file) => entries.has(file)),
    found: signals.filter((signal) => signal.found),
    missing: signals.filter((signal) => !signal.found)
  };
}

async function readDirectoryEntries(root: string): Promise<string[]> {
  try {
    await access(root);
    return readdir(root);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`Repository path does not exist: ${root}`);
    }

    throw new Error(`Unable to read repository path: ${root}`);
  }
}

function createSignal(label: string, found: boolean): RepositorySignal {
  return { label, found };
}

function detectPackageManagerLockfile(entries: Set<string>): string | null {
  return packageManagerFiles.find(({ label }) => entries.has(label))?.label ?? null;
}

function detectPackageManager(lockfile: string | null): PackageManager {
  return packageManagerFiles.find(({ label }) => label === lockfile)?.manager ?? "not detected";
}
