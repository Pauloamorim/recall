import type { Message, Transcript } from "./types.js";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const toIso = (epochSeconds: unknown): string | undefined =>
  typeof epochSeconds === "number" && Number.isFinite(epochSeconds)
    ? new Date(epochSeconds * 1000).toISOString()
    : undefined;

/** Content shape varies by content_type; only the human-readable text is kept. */
function textOf(content: unknown): string {
  if (!isRecord(content)) return "";
  if (Array.isArray(content.parts)) {
    return content.parts
      .filter((p): p is string => typeof p === "string")
      .join("\n")
      .trim();
  }
  return typeof content.text === "string" ? content.text.trim() : "";
}

function toMessage(raw: unknown): Message | undefined {
  if (!isRecord(raw)) return undefined;

  const author = isRecord(raw.author) ? raw.author : undefined;
  const role = author?.role;
  if (role !== "user" && role !== "assistant") return undefined;

  const metadata = isRecord(raw.metadata) ? raw.metadata : undefined;
  if (metadata?.is_visually_hidden_from_conversation === true) return undefined;

  // Anything addressed to a tool rather than "all" is an internal call, not conversation.
  if (typeof raw.recipient === "string" && raw.recipient !== "all") return undefined;

  const text = textOf(raw.content);
  if (!text) return undefined;

  return { role, text, timestamp: toIso(raw.create_time) };
}

const createTime = (node: Record<string, unknown>): number =>
  isRecord(node.message) && typeof node.message.create_time === "number"
    ? node.message.create_time
    : 0;

/**
 * `mapping` is a tree, not a list: regenerated replies leave abandoned branches behind.
 * The conversation the user actually saw is the path from current_node up to the root.
 */
function linearize(mapping: Record<string, unknown>, currentNode: unknown): unknown[] {
  const messages: unknown[] = [];
  const seen = new Set<string>();
  let id = typeof currentNode === "string" ? currentNode : undefined;

  while (id !== undefined && !seen.has(id)) {
    seen.add(id);
    const node = mapping[id];
    if (!isRecord(node)) break;
    if (node.message) messages.push(node.message);
    id = typeof node.parent === "string" ? node.parent : undefined;
  }
  if (messages.length > 0) return messages.reverse();

  // ponytail: some exports have no usable current_node — fall back to every node in
  // time order rather than silently dropping the conversation. Includes abandoned
  // branches, which is better than losing the whole transcript.
  return Object.values(mapping)
    .filter(isRecord)
    .filter((node) => node.message)
    .sort((a, b) => createTime(a) - createTime(b))
    .map((node) => node.message);
}

/** Parse the parsed JSON of a ChatGPT export's `conversations.json`. */
export function parseChatGPTExport(raw: unknown): Transcript[] {
  if (!Array.isArray(raw)) {
    throw new Error("Expected conversations.json to contain an array of conversations");
  }

  const transcripts: Transcript[] = [];

  raw.forEach((conversation, i) => {
    if (!isRecord(conversation)) return;

    const mapping = isRecord(conversation.mapping) ? conversation.mapping : {};
    const messages = linearize(mapping, conversation.current_node)
      .map(toMessage)
      .filter((m): m is Message => m !== undefined);

    if (messages.length === 0) return;

    const id =
      typeof conversation.conversation_id === "string"
        ? conversation.conversation_id
        : typeof conversation.id === "string"
          ? conversation.id
          : `chatgpt-${i}`;

    transcripts.push({
      id,
      source: "chatgpt",
      title:
        typeof conversation.title === "string" && conversation.title
          ? conversation.title
          : "Untitled",
      createdAt: toIso(conversation.create_time),
      messages,
    });
  });

  return transcripts;
}
