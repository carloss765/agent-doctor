import { analyzeReadiness } from "../analyzer/analyzeReadiness.js";
import type { ScanResult } from "../scanner/types.js";

export type ScanCiEvaluation = {
  passed: boolean;
  exitCode: 0 | 2;
  minimumScore: number | null;
  reason: string;
};

export type ScanCiOptions = {
  minimumScore?: number | null;
};

export function evaluateScanCiResult(
  scan: ScanResult,
  options: ScanCiOptions = {}
): ScanCiEvaluation {
  const analysis = analyzeReadiness(scan);
  const minimumScore = options.minimumScore ?? null;

  if (minimumScore === null) {
    return {
      passed: true,
      exitCode: 0,
      minimumScore,
      reason: "No minimum score was configured."
    };
  }

  if (analysis.score >= minimumScore) {
    return {
      passed: true,
      exitCode: 0,
      minimumScore,
      reason: `Score ${analysis.score} meets the required minimum ${minimumScore}.`
    };
  }

  return {
    passed: false,
    exitCode: 2,
    minimumScore,
    reason: `Score ${analysis.score} is below the required minimum ${minimumScore}.`
  };
}

export function formatScanCiResult(scan: ScanResult, options: ScanCiOptions = {}): string {
  const analysis = analyzeReadiness(scan);
  const evaluation = evaluateScanCiResult(scan, options);

  return [
    "Agent Ready CI scan",
    "",
    `Score: ${analysis.score}/100`,
    `Status: ${analysis.status}`,
    `Required minimum: ${evaluation.minimumScore === null ? "not configured" : evaluation.minimumScore}`,
    `Result: ${evaluation.passed ? "pass" : "fail"}`,
    `Reason: ${evaluation.reason}`,
    "No files were modified.",
    "",
    "Next steps:",
    ...analysis.nextSteps.map((step) => `  - ${step}`)
  ].join("\n");
}

export function parseMinimumScoreOption(value: string | undefined): number | null {
  if (value === undefined) {
    return null;
  }

  if (!/^\d+$/.test(value)) {
    throw new Error(`Invalid --min-score value: ${value}. Expected an integer from 0 to 100.`);
  }

  const score = Number(value);

  if (score < 0 || score > 100) {
    throw new Error(`Invalid --min-score value: ${value}. Expected an integer from 0 to 100.`);
  }

  return score;
}
