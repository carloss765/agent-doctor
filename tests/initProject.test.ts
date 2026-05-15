import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { initProject } from "../src/generator/initProject.js";
import { scanRepository } from "../src/scanner/scanRepository.js";

describe("initProject", () => {
  it("creates missing base files", async () => {
    const root = await createTempRepository({
      "package.json": JSON.stringify({
        scripts: {
          dev: "vite dev",
          test: "vitest run"
        }
      }),
      "pnpm-lock.yaml": ""
    });

    try {
      const result = await initProject(await scanRepository(root));
      const agentsMd = await readFile(path.join(root, "AGENTS.md"), "utf8");

      expect(result.files).toEqual([
        { path: "AGENTS.md", status: "created" },
        { path: "DESIGN.md", status: "created" },
        { path: ".env.example", status: "created" }
      ]);
      expect(agentsMd).toContain("Agent Refinement Prompt");
      expect(agentsMd).toContain("- Package manager: pnpm");
      expect(agentsMd).toContain("- Dev: vite dev");
      expect(agentsMd).toContain("- Test: vitest run");
      expect(agentsMd).toContain("Do not invent commands that are not present.");
      expect(agentsMd).toContain("Agent Rules");
      await expect(readFile(path.join(root, "DESIGN.md"), "utf8")).resolves.toContain(
        "Agent Design Prompt"
      );
      await expect(readFile(path.join(root, "DESIGN.md"), "utf8")).resolves.toContain(
        "Do not invent product facts."
      );
      await expect(readFile(path.join(root, "DESIGN.md"), "utf8")).resolves.toContain(
        "Accessibility And Readability Notes"
      );
      await expect(readFile(path.join(root, ".env.example"), "utf8")).resolves.toContain(
        "Never commit real secrets"
      );
      await expect(readdir(root)).resolves.not.toContain(".env");
      await expect(readdir(root)).resolves.not.toContain(".agent-ready");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("does not overwrite existing files", async () => {
    const root = await createTempRepository({
      "AGENTS.md": "custom agent instructions",
      "DESIGN.md": "custom design instructions",
      ".env.example": "CUSTOM_VALUE="
    });

    try {
      const result = await initProject(await scanRepository(root));

      expect(result.files).toEqual([
        { path: "AGENTS.md", status: "skipped" },
        { path: "DESIGN.md", status: "skipped" },
        { path: ".env.example", status: "skipped" }
      ]);
      await expect(readFile(path.join(root, "AGENTS.md"), "utf8")).resolves.toBe(
        "custom agent instructions"
      );
      await expect(readFile(path.join(root, "DESIGN.md"), "utf8")).resolves.toBe(
        "custom design instructions"
      );
      await expect(readFile(path.join(root, ".env.example"), "utf8")).resolves.toBe(
        "CUSTOM_VALUE="
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("is idempotent", async () => {
    const root = await createTempRepository({});

    try {
      await initProject(await scanRepository(root));
      const secondResult = await initProject(await scanRepository(root));

      expect(secondResult.files).toEqual([
        { path: "AGENTS.md", status: "skipped" },
        { path: "DESIGN.md", status: "skipped" },
        { path: ".env.example", status: "skipped" }
      ]);
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
