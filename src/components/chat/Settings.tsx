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

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
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
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
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
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 active:scale-[0.98] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Appearance — theme as card-style buttons */}
          <section className="mb-8">
            <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Appearance
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleThemeChange(option.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 text-center transition-all active:scale-[0.98]
                    ${theme === option.value
                      ? "border-zinc-900 bg-zinc-100 text-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-50"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                    }`}
                >
                  <ThemeIcon theme={option.value} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              System follows your device theme.
            </p>
          </section>

          {/* Development — model and dev-related options */}
          <section className="mb-8">
            <h3 className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Development
            </h3>
            <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
              Backend and API options. Used when you connect the app to OpenRouter or Ollama.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Model source
              </label>
              <select
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* About */}
          <section>
            <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">About</h3>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                AI Chat Application built with Next.js, Tailwind, and Prisma.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "light") {
    return (
      <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (theme === "dark") {
    return (
      <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
