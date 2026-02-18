"use client";

import type { Conversation } from "@/types/chat";

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  conversations,
  selectedId,
  isOpen,
  onClose,
  onNewChat,
  onSelect,
  onOpenSettings,
}: SidebarProps) {
  return (
    <>
      {/* Overlay on mobile when sidebar is open */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950
          transition-transform duration-200 ease-out md:relative md:z-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Conversations"
      >
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200 p-3 dark:border-zinc-800">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Conversations
          </span>
          <button
            type="button"
            onClick={onNewChat}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No conversations yet. Start with &quot;New chat&quot;.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(c.id);
                      onClose();
                    }}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition
                      ${selectedId === c.id
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                      }`}
                  >
                    <span className="line-clamp-1">{c.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            aria-label="Open settings"
          >
            <svg
              className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
