"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const THEME_KEY = "chat-theme";
const MODEL_KEY = "chat-model";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(THEME_KEY) as Theme) ?? "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const dark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (dark) root.classList.add("dark");
  else root.classList.remove("dark");
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODELS = [
  { id: "openrouter-default", label: "OpenRouter (default)" },
  { id: "ollama-local", label: "Ollama (local)" },
];

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [theme, setTheme] = useState<Theme>("system");
  const [model, setModel] = useState("openrouter-default");

  useEffect(() => {
    setTheme(getStoredTheme());
    const stored = typeof window !== "undefined" ? localStorage.getItem(MODEL_KEY) : null;
    if (stored) setModel(stored);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setTheme(getStoredTheme());
  }, [isOpen]);

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
    localStorage.setItem(THEME_KEY, value);
    applyTheme(value);
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    localStorage.setItem(MODEL_KEY, value);
  };

  useEffect(() => {
    applyTheme(getStoredTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (getStoredTheme() === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        aria-label="Close settings"
      />
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 id="settings-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Theme */}
          <section className="mb-8">
            <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Appearance</h3>
            <div className="space-y-2">
              {(["light", "dark", "system"] as const).map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option}
                    checked={theme === option}
                    onChange={() => handleThemeChange(option)}
                    className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
                  />
                  <span className="capitalize text-zinc-900 dark:text-zinc-100">{option}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              System follows your device theme.
            </p>
          </section>

          {/* Model */}
          <section className="mb-8">
            <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Model</h3>
            <select
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Connect the backend to use this setting.
            </p>
          </section>

          {/* About */}
          <section>
            <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">About</h3>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                AI Chat Application built with Next.js, Tailwind, and Prisma. Connect OpenRouter or
                Ollama for live AI responses.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
