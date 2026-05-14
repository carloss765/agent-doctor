#!/usr/bin/env node
import { Command } from "commander";

import { formatInitResult } from "./cli/formatInitResult.js";
import { formatPrescribeResult } from "./cli/formatPrescribeResult.js";
import { formatScanResult } from "./cli/formatScanResult.js";
import { parseRootOption } from "./cli/parseRootOption.js";
import { shouldUseColor, withProgress } from "./cli/presentation.js";
import { initProject } from "./generator/initProject.js";
import { prescribeProject } from "./generator/prescribeProject.js";
import { scanRepository } from "./scanner/scanRepository.js";

const program = new Command();

program
  .name("agent-ready")
  .description("Check whether a repository is ready for coding agents.")
  .version("0.1.0")
  .option("-r, --root <path>", "Repository root to scan.", process.cwd())
  .action(async () => {
    await runScan(getRootOption());
  });

program
  .command("scan")
  .description("Scan the current repository without modifying files.")
  .option("-r, --root <path>", "Repository root to scan.", process.cwd())
  .action(async () => {
    await runScan(getRootOption());
  });

program
  .command("prescribe")
  .description("Generate a prescription prompt for an external coding agent.")
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

async function runScan(root: string): Promise<void> {
  try {
    const color = shouldUseColor();
    const result = await withProgress("Scanning repository...", async () => scanRepository(root), {
      color
    });
    console.log(formatScanResult(result, { color }));
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
