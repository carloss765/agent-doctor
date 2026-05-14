import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import type {
  NodeScript,
  NodeScriptName,
  PackageManager,
  ProjectManifest,
  RepositorySignal,
  ScanResult
} from "./types.js";

const manifestFiles: ProjectManifest[] = [
  "package.json",
  "pyproject.toml",
  "Cargo.toml",
  "go.mod",
  "composer.json"
];

const requiredFiles = ["README.md", "AGENTS.md", ".env.example", "package.json"] as const;
const nodeScriptNames: NodeScriptName[] = ["dev", "build", "test", "lint", "format"];

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
  const scripts = entries.has("package.json") ? await readNodeScripts(normalizedRoot) : [];
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
    scripts,
    missingScripts: detectMissingScripts(scripts),
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

async function readNodeScripts(root: string): Promise<NodeScript[]> {
  const packageJsonPath = path.join(root, "package.json");
  const rawPackageJson = await readFile(packageJsonPath, "utf8");
  const packageJson = parsePackageJson(rawPackageJson, packageJsonPath);

  const scripts = packageJson.scripts;

  if (!isRecord(scripts)) {
    return [];
  }

  return nodeScriptNames.flatMap((name) => {
    const command = scripts[name];

    if (typeof command !== "string" || command.trim().length === 0) {
      return [];
    }

    return [{ name, command }];
  });
}

function parsePackageJson(
  rawPackageJson: string,
  packageJsonPath: string
): Record<string, unknown> {
  try {
    const parsed = JSON.parse(rawPackageJson);

    if (!isRecord(parsed)) {
      throw new Error("package.json root must be an object");
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Unable to parse package.json: ${packageJsonPath}`);
    }

    throw error;
  }
}

function detectMissingScripts(scripts: NodeScript[]): NodeScriptName[] {
  const detectedScriptNames = new Set(scripts.map((script) => script.name));

  return nodeScriptNames.filter((scriptName) => !detectedScriptNames.has(scriptName));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
