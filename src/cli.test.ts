import { expect, test } from "vitest";
import { buildProgram } from "./cli.js";

test("help lists every command", () => {
  const help = buildProgram().helpInformation();
  for (const cmd of ["import", "show", "forget", "stats"]) {
    expect(help).toContain(cmd);
  }
});
