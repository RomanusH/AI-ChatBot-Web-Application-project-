"use client";

import type { Message, Conversation } from "@/types/chat";

interface MessageSearchProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: Message[];
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
  onSelectConversation: (id: string) => void;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageSearch({
  isOpen,
  onClose,
  query,
  onQueryChange,
  results,
  conversations,
  messagesByConversation,
  onSelectConversation,
}: MessageSearchProps) {
  if (!isOpen) return null;

  const totalMessages = Object.values(messagesByConversation).flat().length;

  // Group results by conversation
  const resultsByConversation: Record<string, Message[]> = {};
  for (const msg of results) {
    // Find which conversation this message belongs to
    for (const [convId, messages] of Object.entries(messagesByConversation)) {
      if (messages.find((m) => m.id === msg.id)) {
        if (!resultsByConversation[convId]) {
          resultsByConversation[convId] = [];
        }
        resultsByConversation[convId].push(msg);
        break;
      }
    }
  }

  const handleResultClick = (convId: string) => {
    onSelectConversation(convId);
    onClose();
  };

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        aria-label="Close search"
      />
      <div className="fixed inset-x-0 top-0 z-50 mx-auto max-w-lg p-4">
        <div className="rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search across all conversations..."
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-100"
              autoFocus
            />
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {query ? `${results.length} results across all chats` : `${totalMessages} messages in all conversations`}
            </p>
          </div>
          {query && results.length > 0 && (
            <div className="max-h-96 overflow-y-auto border-t border-zinc-200 dark:border-zinc-700">
              {Object.entries(resultsByConversation).map(([convId, messages]) => {
                const conversation = conversations.find((c) => c.id === convId);
                if (!conversation) return null;
                return (
                  <div key={convId} className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-700">
                    <div className="bg-zinc-50 px-4 py-2 dark:bg-zinc-800/50">
                      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {conversation.title}
                      </p>
                    </div>
                    {messages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => handleResultClick(convId)}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                      >
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className={msg.role === "user" ? "font-medium text-zinc-700 dark:text-zinc-300" : "text-sky-600 dark:text-sky-400"}>
                            {msg.role === "user" ? "You" : "AI"}
                          </span>
                          <span>•</span>
                          <span>{formatTime(msg.timestamp)}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {msg.content}
                        </p>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {query && results.length === 0 && (
            <div className="border-t border-zinc-200 px-4 py-6 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No messages found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
