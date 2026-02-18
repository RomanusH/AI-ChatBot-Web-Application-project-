"use client";

import type { Message as MessageType } from "@/types/chat";

interface MessageBubbleProps {
  message: MessageType;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{message.content}</span>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div
        className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-xs font-medium text-white"
        aria-hidden
      >
        AI
      </div>
      <div className="max-w-[85%] rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-800">
        {message.content}
        {isStreaming && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-zinc-500" />
        )}
      </div>
    </div>
  );
}
