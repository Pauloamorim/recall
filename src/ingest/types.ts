/** Normalized transcript model. Every provider parser outputs this shape. */

export type Role = "user" | "assistant";

export interface Message {
  role: Role;
  text: string;
  /** ISO 8601. Absent when the export omits a timestamp for the message. */
  timestamp?: string;
}

export interface Transcript {
  id: string;
  source: "chatgpt" | "claude";
  title: string;
  /** ISO 8601. */
  createdAt?: string;
  messages: Message[];
}
