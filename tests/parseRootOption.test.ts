import { describe, expect, it } from "vitest";

import { parseRootOption } from "../src/cli/parseRootOption.js";

describe("parseRootOption", () => {
  it("parses --root followed by a path", () => {
    expect(parseRootOption(["scan", "--root", "/tmp/project"], ".")).toBe("/tmp/project");
  });

  it("parses --root=path", () => {
    expect(parseRootOption(["init", "--root=/tmp/project", "--yes"], ".")).toBe("/tmp/project");
  });

  it("parses -r followed by a path", () => {
    expect(parseRootOption(["prescribe", "-r", "/tmp/project"], ".")).toBe("/tmp/project");
  });

  it("falls back when root is not provided", () => {
    expect(parseRootOption(["scan"], ".")).toBe(".");
  });
});
