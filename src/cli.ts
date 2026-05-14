#!/usr/bin/env node
import { Command } from "commander";

import { formatInitResult } from "./cli/formatInitResult.js";
import { formatPrescribeResult } from "./cli/formatPrescribeResult.js";
import { formatScanResult } from "./cli/formatScanResult.js";
import { shouldUseColor } from "./cli/presentation.js";
import { initProject } from "./generator/initProject.js";
import { prescribeProject } from "./generator/prescribeProject.js";
import { scanRepository } from "./scanner/scanRepository.js";

const program = new Command();

program
  .name("agent-doctor")
  .description("Check whether a repository is ready for coding agents.")
  .version("0.1.0");

program
  .command("scan")
  .description("Scan the current repository without modifying files.")
  .option("-r, --root <path>", "Repository root to scan.", process.cwd())
  .action(async (options: { root: string }) => {
    try {
      const result = await scanRepository(options.root);
      console.log(formatScanResult(result, { color: shouldUseColor() }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(
        [
          "Agent Doctor",
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
  });

program
  .command("prescribe")
  .description("Generate a prescription prompt for an external coding agent.")
  .option("-r, --root <path>", "Repository root to inspect.", process.cwd())
  .option("--yes", "Run non-interactively.")
  .action(async (options: { root: string; yes?: boolean }) => {
    try {
      const scan = await scanRepository(options.root);
      const result = await prescribeProject(scan);
      console.log(formatPrescribeResult(result, { color: shouldUseColor() }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(
        [
          "Agent Doctor",
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
  .description("Generate missing Agent Doctor base files without overwriting existing files.")
  .option("-r, --root <path>", "Repository root to initialize.", process.cwd())
  .option("--yes", "Run non-interactively.")
  .action(async (options: { root: string; yes?: boolean }) => {
    try {
      const scan = await scanRepository(options.root);
      const result = await initProject(scan);
      console.log(formatInitResult(result, { color: shouldUseColor() }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(
        [
          "Agent Doctor",
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
  console.error(`Agent Doctor failed: ${message}`);
  process.exitCode = 1;
});
