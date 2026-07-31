import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { parseChatGPTExport } from "./chatgpt.js";

const load = () =>
  parseChatGPTExport(
    JSON.parse(readFileSync(new URL("fixtures/chatgpt-export.json", import.meta.url), "utf8")),
  );

test("golden file", async () => {
  await expect(JSON.stringify(load(), null, 2) + "\n").toMatchFileSnapshot(
    "fixtures/chatgpt-export.expected.json",
  );
});

// Snapshots can be regenerated without thinking; these two invariants cannot.
test("keeps only the branch the user saw, and no tool calls", () => {
  const text = JSON.stringify(load());
  expect(text).not.toContain("ABANDONED");
  expect(text).not.toContain("internal tool call");
});

test("drops conversations with nothing human in them", () => {
  expect(load().map((t) => t.id)).toEqual(["conv-branching", "conv-no-current-node"]);
});
