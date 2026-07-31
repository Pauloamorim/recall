# Recall

Local-first, MCP-native personal memory server. Ingests AI chat exports, distills them
into a small set of durable memories, and serves them to any MCP client so every agent
starts already knowing the user.

## Stack

TypeScript (ESM, strict, Node 18+) · commander · Vitest · SQLite (`better-sqlite3`,
Phase 1) · `@modelcontextprotocol/sdk` (Phase 2). No ESLint, no embeddings, no vector DB.

## Layout

```
src/cli.ts        # CLI entrypoint (commander)
src/ingest/       # export parsers → normalized Transcript[]   (Phase 1)
src/distill/      # LLM judge + post-filters                   (Phase 1)
src/store/        # Markdown source of truth + SQLite index     (Phase 1)
src/server/       # MCP stdio server                            (Phase 2)
```

Directories appear when there is code to put in them. Runtime data lives in `~/.recall/`;
the Markdown files there are the source of truth, SQLite is a rebuildable index.

## Roadmap

`PLAN.md` (git-ignored, local only) holds the phased roadmap. Read it, then work **only**
on the current unchecked milestone.

## Working rules

- Update PLAN.md checkboxes at the end of every session.
- Never widen scope beyond the current milestone; park ideas in `IDEAS.md`.
- Every module gets tests before moving on; the judge gets harness fixtures.
- Verify external facts (MCP SDK API, Claude Code hook payloads) against live docs at
  implementation time rather than assuming.

## Conventions

Strict TS, no default exports, `.js` extensions on relative imports (NodeNext).
Save little: the default answer to "should this be remembered?" is no.
