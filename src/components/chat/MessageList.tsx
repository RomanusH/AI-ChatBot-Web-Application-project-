"use client";

import type { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isEmptyConversation: boolean;
  noConversationSelected: boolean;
  isStreaming?: boolean;
  listRef?: React.RefObject<HTMLElement | null>;
}

export function MessageList({
  messages,
  isEmptyConversation,
  noConversationSelected,
  isStreaming,
  listRef,
}: MessageListProps) {
  if (noConversationSelected) {
    return (
      <section
        className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center"
        aria-label="Message list"
      >
        <p className="max-w-sm text-zinc-500 dark:text-zinc-400">
          Start a new conversation from the sidebar or tap &quot;New chat&quot; to begin.
        </p>
      </section>
    );
  }

  if (isEmptyConversation) {
    return (
      <section
        className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center"
        aria-label="Message list"
      >
        <p className="max-w-sm text-zinc-500 dark:text-zinc-400">
          Send a message below to start.
        </p>
      </section>
    );
  }

  return (
    <section
      ref={listRef}
      className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
      aria-label="Message list"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && msg.id === messages[messages.length - 1]?.id && msg.role === "assistant"}
          />
        ))}
      </div>
    </section>
  );
}
