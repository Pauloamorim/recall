#!/usr/bin/env node
import { Command } from "commander";

/** Phase 0: commands are declared but not implemented. See PLAN.md §4. */
const notYet = (name: string) => () => {
  console.error(`recall ${name}: not implemented yet`);
  process.exitCode = 1;
};

export function buildProgram(): Command {
  const program = new Command();

  program
    .name("recall")
    .description("Your AI's memory of you, as files you own.")
    .version("0.0.0");

  program
    .command("import")
    .description("Import a provider export and distill it into memories")
    .argument("<provider>", "export source: chatgpt")
    .argument("<path>", "path to the export file")
    .action(notYet("import"));

  program
    .command("show")
    .description("Print active memories")
    .argument("[category]", "identity | preference | project | relationship | decision")
    .action(notYet("show"));

  program
    .command("forget")
    .description("Archive a memory by id")
    .argument("<id>")
    .action(notYet("forget"));

  program
    .command("stats")
    .description("Counts per category and reinforcement summary")
    .action(notYet("stats"));

  return program;
}

// ponytail: import.meta.url check keeps buildProgram() importable by tests
if (import.meta.url === `file://${process.argv[1]}`) {
  buildProgram().parse();
}
