import type { ScanResult } from "../scanner/types.js";
import type { ReadinessAnalysis, ReadinessFinding, ReadinessStatus } from "./types.js";

const maxScore = 100;

export function analyzeReadiness(scan: ScanResult): ReadinessAnalysis {
  const findings = createFindings(scan);
  const score = Math.min(
    maxScore,
    findings
      .filter((finding) => finding.earned)
      .reduce((total, finding) => total + finding.points, 0)
  );

  return {
    score,
    status: getReadinessStatus(score),
    findings,
    nextSteps: createNextSteps(scan, score)
  };
}

function createFindings(scan: ScanResult): ReadinessFinding[] {
  return [
    createFinding("README.md", 10, hasFoundSignal(scan, "README.md")),
    createFinding("AGENTS.md", 20, hasFoundSignal(scan, "AGENTS.md")),
    createFinding(".env.example", 10, hasFoundSignal(scan, ".env.example")),
    createFinding("Project manifest", 10, scan.manifests.length > 0),
    createFinding("Git repository", 5, scan.gitDetected),
    createFinding("Package manager lockfile", 5, scan.packageManagerLockfile !== null),
    createFinding("dev script", 5, hasScript(scan, "dev")),
    createFinding("build script", 10, hasScript(scan, "build")),
    createFinding("test script", 10, hasScript(scan, "test")),
    createFinding("lint script", 10, hasScript(scan, "lint")),
    createFinding("format script", 5, hasScript(scan, "format"))
  ];
}

function createFinding(label: string, points: number, earned: boolean): ReadinessFinding {
  return { label, points, earned };
}

function hasFoundSignal(scan: ScanResult, label: string): boolean {
  return scan.found.some((signal) => signal.label === label);
}

function hasScript(scan: ScanResult, scriptName: string): boolean {
  return scan.scripts.some((script) => script.name === scriptName);
}

function getReadinessStatus(score: number): ReadinessStatus {
  if (score >= 80) {
    return "Ready";
  }

  if (score >= 50) {
    return "Almost ready";
  }

  if (score > 0) {
    return "Needs setup";
  }

  return "Not ready";
}

function createNextSteps(scan: ScanResult, score: number): string[] {
  if (score >= 80 && scan.missing.length === 0 && scan.missingScripts.length === 0) {
    return ["This repository is ready for coding agents."];
  }

  const nextSteps: string[] = [];

  if (score === 0) {
    nextSteps.push("Add basic project documentation before using coding agents.");
  }

  if (scan.missing.length > 0) {
    nextSteps.push("Run agent-ready init to generate missing base files.");
  }

  if (scan.missingScripts.length > 0) {
    nextSteps.push("Add missing validation scripts before delegating work to coding agents.");
  }

  if (score >= 50 && score < 80) {
    nextSteps.push(
      "Add the remaining missing files or scripts before using coding agents for larger changes."
    );
  }

  return unique(nextSteps);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
