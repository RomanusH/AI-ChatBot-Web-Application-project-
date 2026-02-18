export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
}
