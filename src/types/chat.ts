export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  edited?: boolean;
  reactions?: Record<string, number>; // emoji -> count
}

export interface Conversation {
  id: string;
  title: string;
}
