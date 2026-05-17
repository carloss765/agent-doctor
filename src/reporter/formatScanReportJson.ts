import { analyzeReadiness } from "../analyzer/analyzeReadiness.js";
import type { ReadinessStatus } from "../analyzer/types.js";
import type {
  AgentToolName,
  NodeScriptName,
  PackageManager,
  ScanResult
} from "../scanner/types.js";

export type ReportSchemaVersion = "1.0";
export type ReportSignalStatus = "detected" | "missing";

export type ReportJsonV1 = {
  schemaVersion: ReportSchemaVersion;
  toolVersion: string;
  root: string;
  summary: {
    score: number;
    status: ReadinessStatus;
  };
  repository: {
    git: {
      status: ReportSignalStatus;
      detected: boolean;
      evidence: string[];
    };
    packageManager: {
      status: ReportSignalStatus;
      name: PackageManager;
      lockfile: string | null;
      evidence: string[];
    };
    manifests: string[];
  };
  signals: Array<{
    label: string;
    status: ReportSignalStatus;
  }>;
  commands: Array<{
    name: NodeScriptName;
    status: ReportSignalStatus;
    command: string | null;
    source: "package.json" | null;
  }>;
  agentTools: Array<{
    name: AgentToolName;
    status: ReportSignalStatus;
    detected: boolean;
    evidence: string[];
  }>;
  skills: Array<{
    directory: string;
    status: ReportSignalStatus;
    count: number;
    evidence: string[];
  }>;
  findings: Array<{
    label: string;
    points: number;
    earned: boolean;
    status: ReportSignalStatus;
  }>;
  recommendations: string[];
};

export type ScanReportOptions = {
  toolVersion: string;
};

const schemaVersion: ReportSchemaVersion = "1.0";
const nodeScriptNames: NodeScriptName[] = ["dev", "build", "test", "lint", "format"];

export function formatScanReportJson(scan: ScanResult, options: ScanReportOptions): string {
  return JSON.stringify(createScanReport(scan, options), null, 2);
}

export function createScanReport(scan: ScanResult, options: ScanReportOptions): ReportJsonV1 {
  const analysis = analyzeReadiness(scan);

  return {
    schemaVersion,
    toolVersion: options.toolVersion,
    root: scan.root,
    summary: {
      score: analysis.score,
      status: analysis.status
    },
    repository: {
      git: {
        status: toStatus(scan.gitDetected),
        detected: scan.gitDetected,
        evidence: scan.gitDetected ? [".git"] : []
      },
      packageManager: {
        status: toStatus(scan.packageManagerLockfile !== null),
        name: scan.packageManager,
        lockfile: scan.packageManagerLockfile,
        evidence: scan.packageManagerLockfile === null ? [] : [scan.packageManagerLockfile]
      },
      manifests: scan.manifests
    },
    signals: [
      ...scan.found.map((signal) => ({ label: signal.label, status: "detected" as const })),
      ...scan.missing.map((signal) => ({ label: signal.label, status: "missing" as const }))
    ],
    commands: nodeScriptNames.map((name) => {
      const script = scan.scripts.find((candidate) => candidate.name === name);

      return {
        name,
        status: toStatus(script !== undefined),
        command: script?.command ?? null,
        source: script === undefined ? null : "package.json"
      };
    }),
    agentTools: scan.agentTools.map((tool) => ({
      name: tool.name,
      status: toStatus(tool.detected),
      detected: tool.detected,
      evidence: tool.files
    })),
    skills: scan.skills.map((skill) => ({
      directory: skill.directory,
      status: toStatus(skill.detected),
      count: skill.count,
      evidence: skill.detected ? [skill.directory] : []
    })),
    findings: analysis.findings.map((finding) => ({
      label: finding.label,
      points: finding.points,
      earned: finding.earned,
      status: toStatus(finding.earned)
    })),
    recommendations: analysis.nextSteps
  };
}

function toStatus(detected: boolean): ReportSignalStatus {
  return detected ? "detected" : "missing";
}
