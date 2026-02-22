"use client";

import { useCallback, useRef, useState } from "react";
import type { Conversation, Message } from "@/types/chat";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import { Settings } from "./Settings";
import { MessageSearch } from "./MessageSearch";
import { TypingIndicator } from "./TypingIndicator";

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
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const listRef = useRef<HTMLElement>(null);

  const allMessages = Object.values(messagesByConversation).flat();
  const searchResults = searchQuery
    ? allMessages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
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

  const generateAIResponse = useCallback((conversationId: string) => {
    setIsStreaming(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "This is a placeholder reply. Connect the backend to get real AI responses.",
        timestamp: Date.now(),
      };
      setMessagesByConversation((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), assistantMessage],
      }));
      setIsStreaming(false);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, 600);
  }, []);

  const handleSend = useCallback(() => {
    const text = composerValue.trim();
    if (!text || !selectedId) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), userMessage],
    }));
    setComposerValue("");

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

    generateAIResponse(selectedId);
  }, [composerValue, selectedId, generateAIResponse]);

  const handleEditMessage = useCallback((messageId: string, newContent: string) => {
    if (!selectedId) return;
    
    // Find the index of the edited message
    const messages = messagesByConversation[selectedId] ?? [];
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;
    
    // Keep messages up to and including the edited message (with new content)
    // Remove any messages after it (AI responses, etc.)
    const updatedMessages = messages.slice(0, messageIndex + 1).map((m) =>
      m.id === messageId ? { ...m, content: newContent, edited: true } : m
    );
    
    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: updatedMessages,
    }));
    
    // Trigger new AI response
    generateAIResponse(selectedId);
  }, [selectedId, messagesByConversation, generateAIResponse]);

  const handleDeleteMessage = useCallback((messageId: string) => {
    if (!selectedId) return;
    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: prev[selectedId]?.filter((m) => m.id !== messageId) ?? [],
    }));
  }, [selectedId]);

  const THUMB_UP = "👍";
  const THUMB_DOWN = "👎";

  const handleReaction = useCallback((messageId: string, emoji: string) => {
    if (!selectedId) return;
    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: prev[selectedId]?.map((m) => {
        if (m.id !== messageId) return m;
        const current = m.reactions?.[emoji] ?? 0;
        const otherEmoji = emoji === THUMB_UP ? THUMB_DOWN : THUMB_UP;
        const newReactions: Record<string, number> = {};
        
        if (current > 0) {
          // If already has this reaction, remove it (toggle off)
          // newReactions stays empty
        } else {
          // Add this reaction, remove the other if exists
          newReactions[emoji] = 1;
        }
        
        return {
          ...m,
          reactions: Object.keys(newReactions).length > 0 ? newReactions : undefined,
        };
      }) ?? [],
    }));
  }, [selectedId]);

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
      <MessageSearch
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery("");
        }}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        results={searchResults}
        conversations={conversations}
        messagesByConversation={messagesByConversation}
        onSelectConversation={handleSelect}
      />
      <div className="flex min-w-0 flex-1 flex-col md:ml-0">
        <Header
          title={currentTitle}
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <MessageList
          messages={currentMessages}
          isEmptyConversation={isEmptyConversation}
          noConversationSelected={noConversationSelected}
          isStreaming={isStreaming}
          listRef={listRef}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
          onReaction={handleReaction}
        />
        <TypingIndicator isTyping={isTyping || isStreaming} />
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
