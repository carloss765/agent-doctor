import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { GeneratedFile } from "./types.js";

export type PlannedFile = {
  relativePath: string;
  content: string;
};

export async function writeIfMissing(
  root: string,
  plannedFile: PlannedFile
): Promise<GeneratedFile> {
  const targetPath = path.join(root, plannedFile.relativePath);

  if (await exists(targetPath)) {
    return {
      path: plannedFile.relativePath,
      status: "skipped"
    };
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, plannedFile.content, "utf8");

  return {
    path: plannedFile.relativePath,
    status: "created"
  };
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}
