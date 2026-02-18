"use client";

import { useCallback, useRef, useState } from "react";
import type { Conversation, Message } from "@/types/chat";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import { Settings } from "./Settings";

function generateId() {
  return Math.random().toString(36).slice(2, 12);
}

export function ChatScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [composerValue, setComposerValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const listRef = useRef<HTMLElement>(null);

  const currentMessages = selectedId ? messagesByConversation[selectedId] ?? [] : [];
  const currentTitle = selectedId
    ? conversations.find((c) => c.id === selectedId)?.title ?? "New chat"
    : "New chat";
  const noConversationSelected = selectedId === null;
  const isEmptyConversation = currentMessages.length === 0;

  const handleNewChat = useCallback(() => {
    const id = generateId();
    const conv: Conversation = { id, title: "New conversation" };
    setConversations((prev) => [conv, ...prev]);
    setMessagesByConversation((prev) => ({ ...prev, [id]: [] }));
    setSelectedId(id);
    setComposerValue("");
    setSidebarOpen(false);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleSend = useCallback(() => {
    const text = composerValue.trim();
    if (!text || !selectedId) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: text,
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), userMessage],
    }));
    setComposerValue("");
    setIsStreaming(true);

    // Mock assistant reply (no backend). Update conversation title from first user message.
    setConversations((prev) => {
      const conv = prev.find((c) => c.id === selectedId);
      if (conv?.title === "New conversation") {
        return prev.map((c) =>
          c.id === selectedId ? { ...c, title: text.slice(0, 40) + (text.length > 40 ? "…" : "") } : c
        );
      }
      return prev;
    });

    setTimeout(() => {
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "This is a placeholder reply. Connect the backend to get real AI responses.",
      };
      setMessagesByConversation((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] ?? []), assistantMessage],
      }));
      setIsStreaming(false);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, 600);
  }, [composerValue, selectedId]);

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <Sidebar
        conversations={conversations}
        selectedId={selectedId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelect={handleSelect}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col md:ml-0">
        <Header title={currentTitle} onMenuClick={() => setSidebarOpen(true)} />
        <MessageList
          messages={currentMessages}
          isEmptyConversation={isEmptyConversation}
          noConversationSelected={noConversationSelected}
          isStreaming={isStreaming}
          listRef={listRef}
        />
        <Composer
          value={composerValue}
          onChange={setComposerValue}
          onSend={handleSend}
          disabled={noConversationSelected || isStreaming}
          placeholder={noConversationSelected ? "Start a new chat to send a message" : "Message…"}
        />
      </div>
    </div>
  );
}
