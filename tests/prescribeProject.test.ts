import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { prescribeProject } from "../src/generator/prescribeProject.js";
import { scanRepository } from "../src/scanner/scanRepository.js";

describe("prescribeProject", () => {
  it("creates a prescription file", async () => {
    const root = await createTempRepository({
      "README.md": "# Test Project",
      "package.json": "{}",
      "pnpm-lock.yaml": ""
    });

    try {
      const result = await prescribeProject(await scanRepository(root));
      const prescription = await readFile(path.join(root, ".agent-ready/prescription.md"), "utf8");

      expect(result.files).toEqual([{ path: ".agent-ready/prescription.md", status: "created" }]);
      expect(prescription).toContain("# Agent Ready Prescription");
      expect(prescription).toContain("## Agent Readiness");
      expect(prescription).toContain("- Score: 25/100");
      expect(prescription).toContain("- Status: Needs setup");
      expect(prescription).toContain("## Missing Files");
      expect(prescription).toContain("## Missing Scripts");
      expect(prescription).toContain("## Recommended Next Steps");
      expect(prescription).toContain("## AGENTS.md Refinement Task");
      expect(prescription).toContain("Do not invent project details");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("does not overwrite an existing prescription", async () => {
    const root = await createTempRepository({
      ".agent-ready/prescription.md": "custom prescription"
    });

    try {
      const result = await prescribeProject(await scanRepository(root));

      expect(result.files).toEqual([{ path: ".agent-ready/prescription.md", status: "skipped" }]);
      await expect(readFile(path.join(root, ".agent-ready/prescription.md"), "utf8")).resolves.toBe(
        "custom prescription"
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("does not modify unrelated files", async () => {
    const root = await createTempRepository({
      "README.md": "# Existing",
      "AGENTS.md": "custom instructions",
      ".env.example": "CUSTOM_VALUE=",
      "package.json": "{}"
    });

    try {
      await prescribeProject(await scanRepository(root));

      await expect(readFile(path.join(root, "README.md"), "utf8")).resolves.toBe("# Existing");
      await expect(readFile(path.join(root, "AGENTS.md"), "utf8")).resolves.toBe(
        "custom instructions"
      );
      await expect(readFile(path.join(root, ".env.example"), "utf8")).resolves.toBe(
        "CUSTOM_VALUE="
      );
      await expect(readFile(path.join(root, "package.json"), "utf8")).resolves.toBe("{}");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("generates deterministic content for equivalent repositories", async () => {
    const firstRoot = await createTempRepository({
      "README.md": "# Test Project",
      "package.json": "{}",
      "pnpm-lock.yaml": ""
    });
    const secondRoot = await createTempRepository({
      "README.md": "# Test Project",
      "package.json": "{}",
      "pnpm-lock.yaml": ""
    });

    try {
      await prescribeProject(await scanRepository(firstRoot));
      await prescribeProject(await scanRepository(secondRoot));

      await expect(
        readFile(path.join(firstRoot, ".agent-ready/prescription.md"), "utf8")
      ).resolves.toBe(
        await readFile(path.join(secondRoot, ".agent-ready/prescription.md"), "utf8")
      );
    } finally {
      await rm(firstRoot, { recursive: true, force: true });
      await rm(secondRoot, { recursive: true, force: true });
    }
  });

  it("creates only the prescription under .agent-ready", async () => {
    const root = await createTempRepository({});

    try {
      await prescribeProject(await scanRepository(root));

      await expect(readdir(path.join(root, ".agent-ready"))).resolves.toEqual(["prescription.md"]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

async function createTempRepository(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "agent-ready-"));

  await Promise.all(
    Object.entries(files).map(async ([file, content]) => {
      const target = path.join(root, file);

      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    })
  );

  return root;
}
