export type PackageManager = "pnpm" | "npm" | "yarn" | "bun" | "not detected";

export type ProjectManifest =
  | "package.json"
  | "pyproject.toml"
  | "Cargo.toml"
  | "go.mod"
  | "composer.json";

export type RepositorySignal = {
  label: string;
  found: boolean;
};

export type NodeScriptName = "dev" | "build" | "test" | "lint" | "format";

export type NodeScript = {
  name: NodeScriptName;
  command: string;
};

export type ScanResult = {
  root: string;
  packageManager: PackageManager;
  packageManagerLockfile: string | null;
  gitDetected: boolean;
  manifests: ProjectManifest[];
  scripts: NodeScript[];
  missingScripts: NodeScriptName[];
  found: RepositorySignal[];
  missing: RepositorySignal[];
};
