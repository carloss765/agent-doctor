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

export type AgentToolName = "Codex" | "Claude Code" | "OpenCode" | "Cursor" | "Windsurf";

export type AgentToolSignal = {
  name: AgentToolName;
  detected: boolean;
  files: string[];
};

export type SkillSignal = {
  directory: string;
  detected: boolean;
  count: number;
};

export type ScanResult = {
  root: string;
  packageManager: PackageManager;
  packageManagerLockfile: string | null;
  gitDetected: boolean;
  manifests: ProjectManifest[];
  scripts: NodeScript[];
  missingScripts: NodeScriptName[];
  agentTools: AgentToolSignal[];
  skills: SkillSignal[];
  found: RepositorySignal[];
  missing: RepositorySignal[];
};
