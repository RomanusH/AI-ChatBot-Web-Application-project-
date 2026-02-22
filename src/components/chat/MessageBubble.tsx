"use client";

import { useState } from "react";
import type { Message as MessageType } from "@/types/chat";

interface MessageBubbleProps {
  message: MessageType;
  isStreaming?: boolean;
  onEdit?: (id: string, newContent: string) => void;
  onDelete?: (id: string) => void;
  onReaction?: (id: string, emoji: string) => void;
}

const THUMB_UP = "👍";
const THUMB_DOWN = "�";

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function MessageBubble({ message, isStreaming, onEdit, onDelete, onReaction }: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEdit = () => {
    if (editValue.trim() && editValue !== message.content) {
      onEdit?.(message.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleReaction = (emoji: string) => {
    onReaction?.(message.id, emoji);
    setShowEmojiPicker(false);
  };

  if (message.role === "system") {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{message.content}</span>
      </div>
    );
  }

  if (isEditing && message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-zinc-900 px-4 py-2.5 dark:bg-zinc-100">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full resize-none bg-transparent text-sm text-zinc-50 dark:text-zinc-900 outline-none"
            rows={2}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleEdit();
              }
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditValue(message.content);
              }
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-xs bg-zinc-700 text-zinc-50 rounded hover:bg-zinc-600 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditValue(message.content);
              }}
              className="px-3 py-1 text-xs bg-transparent text-zinc-400 hover:text-zinc-200 dark:text-zinc-500 dark:hover:text-zinc-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="group flex flex-col items-end gap-1">
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
            {message.content}
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {formatRelativeTime(message.timestamp)}
            {message.edited && " (edited)"}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            title="Edit"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete?.(message.id)}
            className="p-1 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400"
            title="Delete"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2">
      <div
        className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-xs font-medium text-white"
        aria-hidden
      >
        AI
      </div>
      <div className="flex flex-col gap-1">
        <div className="max-w-[85%] rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm leading-relaxed dark:border-zinc-700 dark:bg-zinc-800">
          {message.content}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-zinc-500" />
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {formatRelativeTime(message.timestamp)}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => handleReaction(THUMB_UP)}
              className={`p-1 rounded ${message.reactions?.[THUMB_UP] ? "text-blue-500" : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"}`}
              title="Helpful"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </button>
            <button
              onClick={() => handleReaction(THUMB_DOWN)}
              className={`p-1 rounded ${message.reactions?.[THUMB_DOWN] ? "text-red-500" : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"}`}
              title="Not helpful"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 20h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5" />
              </svg>
            </button>
          </div>
        </div>
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex gap-1">
            {Object.entries(message.reactions).map(([emoji]) => (
              <span
                key={emoji}
                className={`flex items-center rounded-full px-2 py-0.5 text-xs ${
                  emoji === THUMB_UP 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {emoji === THUMB_UP ? (
                  <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 20h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5" />
                  </svg>
                )}
                {emoji === THUMB_UP ? "Helpful" : "Not helpful"}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
