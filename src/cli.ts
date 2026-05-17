#!/usr/bin/env node
import { Command } from "commander";

import { formatCommandList } from "./cli/formatCommandList.js";
import { formatInitResult } from "./cli/formatInitResult.js";
import { formatPrescribeResult } from "./cli/formatPrescribeResult.js";
import {
  evaluateScanCiResult,
  formatScanCiResult,
  parseMinimumScoreOption
} from "./cli/formatScanCiResult.js";
import { formatScanResult } from "./cli/formatScanResult.js";
import { parseRootOption } from "./cli/parseRootOption.js";
import { shouldUseColor, withProgress } from "./cli/presentation.js";
import { initProject } from "./generator/initProject.js";
import { prescribeProject } from "./generator/prescribeProject.js";
import { formatScanReportJson } from "./reporter/formatScanReportJson.js";
import { scanRepository } from "./scanner/scanRepository.js";

const program = new Command();
const toolVersion = "0.2.0";

type ScanCommandOptions = {
  ci?: boolean;
  json?: boolean;
  minScore?: string;
};

program
  .name("agent-ready")
  .description("Check whether a repository is ready for coding agents.")
  .version(toolVersion)
  .action(() => {
    console.log(formatCommandList({ color: shouldUseColor() }));
  });

program
  .command("scan")
  .description("Scan the current repository without modifying files.")
  .option("-r, --root <path>", "Repository root to scan.", process.cwd())
  .option("--ci", "Run in non-interactive CI mode.")
  .option("--json", "Print stable machine-readable JSON.")
  .option("--min-score <score>", "Fail CI mode when readiness score is below this value.")
  .action(async (options: ScanCommandOptions) => {
    await runScan(getRootOption(), {
      ci: options.ci ?? false,
      json: options.json ?? false,
      minScore: options.minScore
    });
  });

program
  .command("prescribe")
  .description("Generate a prescription prompt for the coding agent you already use.")
  .option("-r, --root <path>", "Repository root to inspect.", process.cwd())
  .option("--yes", "Run non-interactively.")
  .action(async () => {
    try {
      const color = shouldUseColor();
      const result = await withProgress(
        "Generating prescription...",
        async () => prescribeProject(await scanRepository(getRootOption())),
        { color }
      );
      console.log(formatPrescribeResult(result, { color }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(
        [
          "Agent Ready",
          "",
          "Prescription failed.",
          "",
          "Error:",
          `  ${message}`,
          "",
          "Existing files were not overwritten."
        ].join("\n")
      );
      process.exitCode = 1;
    }
  });

program
  .command("init")
  .description("Generate missing Agent Ready base files without overwriting existing files.")
  .option("-r, --root <path>", "Repository root to initialize.", process.cwd())
  .option("--yes", "Run non-interactively.")
  .action(async () => {
    try {
      const color = shouldUseColor();
      const result = await withProgress(
        "Preparing base files...",
        async () => initProject(await scanRepository(getRootOption())),
        { color }
      );
      console.log(formatInitResult(result, { color }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(
        [
          "Agent Ready",
          "",
          "Init failed.",
          "",
          "Error:",
          `  ${message}`,
          "",
          "Existing files were not overwritten."
        ].join("\n")
      );
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Agent Ready failed: ${message}`);
  process.exitCode = 1;
});

async function runScan(root: string, options: ScanCommandOptions = {}): Promise<void> {
  try {
    const minimumScore = parseMinimumScoreOption(options.minScore);

    if (minimumScore !== null && options.ci !== true) {
      throw new Error("--min-score can only be used with --ci.");
    }

    const color = options.ci === true || options.json === true ? false : shouldUseColor();
    const result =
      options.json === true || options.ci === true
        ? await scanRepository(root)
        : await withProgress("Scanning repository...", async () => scanRepository(root), {
            color
          });

    console.log(
      options.json === true
        ? formatScanReportJson(result, { toolVersion })
        : options.ci === true
          ? formatScanCiResult(result, { minimumScore })
          : formatScanResult(result, { color })
    );

    if (options.ci === true) {
      process.exitCode = evaluateScanCiResult(result, { minimumScore }).exitCode;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(
      [
        "Agent Ready",
        "",
        "Scan failed.",
        "",
        "Error:",
        `  ${message}`,
        "",
        "No files were modified."
      ].join("\n")
    );
    process.exitCode = 1;
  }
}

function getRootOption(): string {
  return parseRootOption(process.argv.slice(2), process.cwd());
}
